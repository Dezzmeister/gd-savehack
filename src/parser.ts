import {
	CoinStatKey,
	difficulties,
	gameEvents,
	gKeys,
	isGKey,
	isSimpleTag,
	isStatKey,
	isStrObj,
	isTag,
	kcekKeys,
	lengths,
	LevelKey,
	levelKeys,
	levelTypes,
	PartialReadableSave,
	ReadableGKey,
	ReadableSave,
	ReadableSaveOthers,
	SimpleTag,
	statKeys,
	Stats,
	StrObj,
	Value,
} from './keys';
import zlib from 'zlib';
import { JSDOM } from 'jsdom';

export function readGDSaveFile(file: Buffer): ReadableSave {
	const xored = file.map((x) => x ^ 11);
	const str = Buffer.from(xored).toString().replace(/\-/g, '+').replace(/_/g, '/');
	const decoded = Buffer.from(str, 'base64');
	const rawXml = zlib
		.gunzipSync(decoded, { windowBits: 15 })
		.toString('ascii')
		.replace(/[^\x00-\x7F]/g, '?')
		.replace(/[\0-\37]/g, '');
	const dom = new JSDOM(rawXml, { contentType: 'text/xml' });
	const doc = dom.window.document.children[0].children[0];

	return parseUnreadableSave(doc);
}

function makeStatsObject(data: PartialReadableSave['stats']): Stats {
	if (typeof data !== 'object') {
		return {};
	}

	const newStats: Stats = {};
	Object.keys(data).forEach((key) => {
		if (data[key] === undefined || typeof data[key] === 'boolean') {
			return;
		}

		if (isStatKey(key)) {
			const keyName = statKeys[key];
			newStats[keyName] = toInt(data[key] as string | number);
			return;
		}

		if (key.includes('unique')) {
			newStats[key as CoinStatKey] = data[key] as string;
		}
	});

	return newStats;
}
/*
function makeRewardObject(data: StrObj<Value>): StrObj<Value> {
	const out: StrObj<Value> = {};

	for (const key in data) {
		if (key === 'kCEK') {
			out['type'] = kcekKeys[data[key] as keyof typeof kcekKeys];
			continue;
		}


	}
}
*/
function makeLevelObjects(data: Value): StrObj<Value> {
	if (!isStrObj(data)) {
		return {};
	}

	const out: StrObj<Value> = {};

	for (const levelId in data) {
		const levelData = data[levelId];

		if (typeof levelData !== 'object') {
			continue;
		}

		out[levelId] = makeLevelObject(data[levelId] as StrObj<Value>);
	}

	return out;
}

function makeLevelObject(data: StrObj<Value>): StrObj<Value> {
	const out: StrObj<Value> = {};

	for (const key in data) {
		if (key === 'kCEK') {
			out['itemType'] = kcekKeys[data[key] as keyof typeof kcekKeys];
			continue;
		}

		if (!key.startsWith('k')) {
			out[key] = data[key];
			continue;
		}

		const newKey = levelKeys[key as LevelKey];
		out[newKey] = data[key];
	}

	if (out.difficulty) {
		out.difficulty = difficulties[(out.difficulty as number) - 1];
	}

	if (out.levelType) {
		out.levelType = levelTypes[(out.levelType as number) - 1];
	}

	if (out.lengths) {
		out.lengths = lengths[(out.length as number) - 1];
	}

	return out;
}

function makeGameEventsObject(data: Value): StrObj<Value> {
	if (typeof data !== 'object') {
		return {};
	}

	const out: StrObj<Value> = {};

	for (const key in data) {
		if (typeof key !== 'string') {
			continue;
		}

		if (key.includes('_')) {
			const event = key.split('_')[1];
			const eventName = gameEvents[event as keyof typeof gameEvents];
			out[eventName] = data[key];
		}
	}

	return out;
}

function parseUnreadableSave(data: Element): ReadableSave {
	return parsePartialReadable(parseXML(data));
}

function parsePartialReadable(data: PartialReadableSave): ReadableSave {
	const out: ReadableSaveOthers = { ...data };
	const stats = data.stats ? makeStatsObject(data.stats) : undefined;
	const gauntlets = data.gauntlets ? makeLevelObjects(data.gauntlets) : undefined;
	const officialLevels = data.officialLevels ? makeLevelObjects(data.officialLevels) : undefined;
	const onlineLevels = data.onlineLevels ? makeLevelObjects(data.onlineLevels) : undefined;
	const timelyLevels = data.timelyLevels ? makeLevelObjects(data.timelyLevels) : undefined;
	const unlockValueKeeper = data.unlockValueKeeper ? makeGameEventsObject(data.unlockValueKeeper) : undefined;

	return { ...out, stats, gauntlets, officialLevels, onlineLevels, timelyLevels, unlockValueKeeper };
}

/**
 * Parse RobTop's weird XML format into a more readable and sensible POJO
 * The object returned can be made more readable with parsePartialReadable()
 */
function parseXML(data: Element): PartialReadableSave {
	const raw: StrObj<Element> = {};
	const res: PartialReadableSave = {};

	for (let i = 0; i < data.children.length; i += 2) {
		const rawKeyName = data.children[i].innerHTML;

		if (!isGKey(rawKeyName)) {
			continue;
		}

		const keyName = gKeys[rawKeyName];
		// This is an interesting way to store KV pairs; the keys and values are stored
		// sequentially with each value following its corresponding key
		const valueTag = data.children[i + 1];
		const tagName = valueTag.tagName;

		if (!isTag(tagName)) {
			continue;
		}

		if (tagName === 'd') {
			raw[keyName] = valueTag;
		} else {
			const value = parseValue(tagName, valueTag.innerHTML);
			res[keyName] = value;
		}
	}

	Object.keys(raw)
		.sort()
		.forEach((x) => {
			res[x as ReadableGKey] = parseDict(raw[x]);
		});

	return res;
}

function parseDict(dict: Element): StrObj<Value> {
	if (!dict || !dict.children || !dict.children.length) {
		return {};
	}

	const dictObj: StrObj<Value> = {};

	for (let i = 0; i < dict.children.length; i += 2) {
		const keyName = dict.children[i].innerHTML;
		const keyValue = dict.children[i + 1];
		if (keyValue && keyValue.children.length) {
			dictObj[keyName] = parseDict(keyValue);
		} else if (keyValue) {
			const tagName = keyValue.tagName;

			if (!isSimpleTag(tagName)) {
				continue;
			}

			dictObj[keyName] = parseValue(tagName, keyValue.innerHTML);
		}
	}

	return dictObj;
}

function parseValue(tag: SimpleTag, rawValue: string): Value {
	switch (tag) {
		case 'r':
			return parseFloat(rawValue);
		case 'i':
			return parseInt(rawValue);
		case 's':
			return rawValue;
		case 't':
			return true;
		case 'f':
			return false;
	}
}

function toInt(item: string | number): number {
	if (typeof item === 'number') {
		return item;
	}

	return parseInt(item);
}
