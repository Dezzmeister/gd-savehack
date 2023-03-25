import {
	invDifficulties,
	invGameEvents,
	invGKeys,
	invKcekKeys,
	invLengths,
	invLevelKeys,
	invLevelTypes,
	invStatKeys,
} from './invkeys';
import { CoinStatKey, isStrObj, PartialReadableSave, ReadableSave, StatName, StrObj, Value } from './keys';
import zlib from 'zlib';

export const GJ_VER = '2.0';

export function deparseReadableSave(data: ReadableSave): Buffer {
	const unlockValueKeeper = revertGameEventsObject((data.unlockValueKeeper || {}) as StrObj<Value>);
	const timelyLevels = revertLevelObjects((data.timelyLevels || {}) as StrObj<Value>);
	const onlineLevels = revertLevelObjects((data.onlineLevels || {}) as StrObj<Value>);
	const officialLevels = revertLevelObjects((data.officialLevels || {}) as StrObj<Value>);
	const gauntlets = revertLevelObjects((data.gauntlets || {}) as StrObj<Value>);
	const stats = revertStatsObject(data.stats);
	const partialSave: PartialReadableSave = {
		...data,
		stats,
		gauntlets,
		officialLevels,
		onlineLevels,
		timelyLevels,
		unlockValueKeeper,
	};
	const unreadableSave = revertGKeys(partialSave);
	const xml = generateXML(unreadableSave);

	return generateGDSaveFile(xml);
}

export function generateGDSaveFile(data: string): Buffer {
	const compressed = zlib.gzipSync(data, { windowBits: 15 });
	const encoded = Buffer.from(compressed).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
	const xored = Buffer.from(encoded).map((x) => x ^ 11);
	return Buffer.from(xored);
}

function revertGameEventsObject(data: StrObj<Value>): StrObj<Value> {
	const out: StrObj<Value> = {};

	for (const key in data) {
		if (typeof key !== 'string') {
			continue;
		}

		const invKey = invGameEvents[key];
		out[`ugv_${invKey}`] = data[key];
	}

	return out;
}

function revertLevelObjects(data: StrObj<Value>): StrObj<Value> {
	if (!isStrObj(data)) {
		return {};
	}

	const out: StrObj<Value> = {};

	for (const levelId in data) {
		const levelData = data[levelId];

		if (typeof levelData !== 'object') {
			continue;
		}

		out[levelId] = revertLevelObject(data[levelId] as StrObj<Value>);
	}

	return out;
}

function revertLevelObject(rawData: StrObj<Value>): StrObj<Value> {
	const data = { ...rawData };
	const out: StrObj<Value> = {};

	if (data.difficulty) {
		data.difficulty = invDifficulties[data.difficulty as string] + 1;
	}

	if (data.levelType) {
		data.levelType = invLevelTypes[data.levelType as string] + 1;
	}

	if (data.lengths) {
		data.lengths = invLengths[data.length as string] + 1;
	}

	for (const key in data) {
		const invKey = invLevelKeys[key];

		if (typeof invKey === 'boolean') {
			continue;
		}

		if (key === 'itemType') {
			out['kCEK'] = invKcekKeys[data[key] as string];
			continue;
		}

		if (typeof invKey === 'string') {
			out[invKey] = data[key];
			continue;
		}
	}

	return out;
}

function revertStatsObject(data: ReadableSave['stats']): Value {
	if (!data) {
		return {};
	}

	const newStats: PartialReadableSave['stats'] = {};

	Object.keys(data).forEach((key) => {
		if (key.includes('unique')) {
			newStats[key] = data[key as CoinStatKey] as Value;
			return;
		}

		const newKey = invStatKeys[key];
		newStats[newKey] = data[key as StatName] as Value;
	});

	return newStats;
}

function revertGKeys(data: PartialReadableSave): StrObj<Value> {
	const out: StrObj<Value> = {};

	for (const key in data) {
		const invKey = invGKeys[key];
		out[invKey] = data[key as keyof PartialReadableSave] as Value;
	}

	return out;
}

function generateXML(data: StrObj<Value>): string {
	return `<?xml version="1.0"?><plist version="1.0" gjver="${GJ_VER}"><dict>${parseObject(
		data,
		false,
	)}</dict></plist>`;
}

function parseObject(obj: StrObj<Value>, includeTags = true): string {
	let out = includeTags ? '<d>' : '';
	for (const key in obj) {
		out += `<k>${key}</k>${parseValue(obj[key])}`;
	}

	return out + (includeTags ? '</d>' : '');
}

function parseValue(value: Value): string {
	switch (typeof value) {
		case 'number': {
			if (isFloat(value)) {
				return `<r>${value}</r>`;
			}

			return `<i>${value}</i>`;
		}
		case 'string': {
			return `<s>${value}</s>`;
		}
		case 'boolean': {
			if (value) {
				return '<t />';
			}

			return '<f />';
		}
		case 'object': {
			return parseObject(value);
		}
	}
}

function isFloat(val: number): boolean {
	return val === +val && val !== (val | 0);
}
