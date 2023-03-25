import randomNormal from 'random-normal';
import { setAchievements } from './achievement';
import { LevelInfo, getLevelInfo, buildMapPackCache } from './api';
import { getCache } from './cache';
import { invGameEvents } from './invkeys';
import { demonTypesFull, GameEvent, ReadableSave, StrObj, Value } from './keys';

export type UnlockableValue = 'all' | GameEvent;
export type IconType = typeof iconInfo[number]['type'];

export type LevelList = {
	id: number;
	info: LevelInfo;
	attempts?: number;
	jumps?: number;
}[];

const RAND_MAX = 2500000;
const RAND_MIN = 50000;
const RAND_RANGE = RAND_MAX - RAND_MIN;

export const iconInfo = <const>[
	{
		type: 'cube',
		total: 142,
		mappedName: 'i',
	},
	{
		type: 'ship',
		total: 51,
		mappedName: 'ship',
	},
	{
		type: 'ball',
		total: 43,
		mappedName: 'ball',
	},
	{
		type: 'ufo',
		total: 35,
		mappedName: 'bird',
	},
	{
		type: 'wave',
		total: 35,
		mappedName: 'dart',
	},
	{
		type: 'robot',
		total: 26,
		mappedName: 'robot',
	},
	{
		type: 'spider',
		total: 17,
		mappedName: 'spider',
	},
	{
		type: 'trail',
		total: 7,
		mappedName: 'special',
	},
	{
		type: 'death',
		total: 17,
		mappedName: 'death',
	},
	{
		type: 'primary',
		total: 42,
		mappedName: 'c0',
	},
	{
		type: 'secondary',
		total: 42,
		mappedName: 'c1',
	},
];

const officialLevels = <const>{
	'Stereo Madness': {
		itemType: 'level',
		id: 1,
		stars: 1,
		name: 'Stereo Madness',
		difficulty: 'Easy',
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_98_29_40_29_29_29_29_29_29_177_29_73_29_29_29',
	},
	'Back On Track': {
		itemType: 'level',
		id: 2,
		stars: 2,
		name: 'Back On Track',
		difficulty: 'Easy',
		officialSongID: 1,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_54_29_40_29_29_29_29_29_29_98_29_54_29_29_29',
	},
	Polargeist: {
		itemType: 'level',
		id: 3,
		stars: 3,
		name: 'Polargeist',
		difficulty: 'Normal',
		officialSongID: 2,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_98_29_40_29_29_29_29_29_29_29_29_98_29_29_29',
	},
	'Dry Out': {
		itemType: 'level',
		id: 4,
		stars: 4,
		name: 'Dry Out',
		difficulty: 'Normal',
		officialSongID: 3,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_73_29_40_29_29_29_29_29_29_73_29_73_29_29_29',
	},
	'Base After Base': {
		itemType: 'level',
		id: 5,
		stars: 5,
		name: 'Base After Base',
		difficulty: 'Hard',
		officialSongID: 4,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_73_29_40_29_29_29_29_29_29_98_29_73_29_29_29',
	},
	'Cant Let Go': {
		itemType: 'level',
		id: 6,
		stars: 6,
		name: 'Cant Let Go',
		difficulty: 'Hard',
		officialSongID: 5,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_73_29_40_29_29_29_29_29_29_29_29_73_29_29_29',
	},
	Jumper: {
		itemType: 'level',
		id: 7,
		stars: 7,
		name: 'Jumper',
		difficulty: 'Harder',
		officialSongID: 6,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_98_29_40_29_29_29_29_29_29_98_29_98_29_29_29',
	},
	'Time Machine': {
		itemType: 'level',
		id: 8,
		stars: 8,
		name: 'Time Machine',
		difficulty: 'Harder',
		officialSongID: 7,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_132_29_40_29_29_29_29_29_29_73_29_98_29_29_29',
	},
	Cycles: {
		itemType: 'level',
		id: 9,
		stars: 9,
		name: 'Cycles',
		difficulty: 'Harder',
		officialSongID: 8,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_98_29_40_29_29_29_40_29_29_98_29_98_29_29_29',
	},
	xStep: {
		itemType: 'level',
		id: 10,
		stars: 10,
		name: 'xStep',
		difficulty: 'Insane',
		officialSongID: 9,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_132_29_40_29_29_29_54_29_29_132_29_73_29_29_29',
	},
	Clutterfunk: {
		itemType: 'level',
		id: 11,
		stars: 11,
		name: 'Clutterfunk',
		difficulty: 'Insane',
		officialSongID: 10,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_237_29_40_29_29_29_73_29_29_29_29_98_29_29_29',
	},
	'Theory of Everything': {
		itemType: 'level',
		id: 12,
		stars: 12,
		name: 'Theory of Everything',
		difficulty: 'Insane',
		officialSongID: 11,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_237_29_54_29_29_29_73_29_29_132_29_132_29_29_29',
	},
	'Electroman Adventures': {
		itemType: 'level',
		id: 13,
		stars: 10,
		name: 'Electroman Adventures',
		difficulty: 'Insane',
		officialSongID: 12,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_237_29_40_29_29_29_98_29_29_98_29_132_29_29_29',
	},
	Clubstep: {
		itemType: 'level',
		id: 14,
		demon: true,
		demonType: 4,
		stars: 14,
		name: 'Clubstep',
		difficulty: 'Demon',
		officialSongID: 13,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_237_29_54_29_29_29_132_29_29_98_29_132_29_29_29',
		secretCoinsToUnlock: 10,
	},
	Electrodynamix: {
		itemType: 'level',
		id: 15,
		stars: 12,
		name: 'Electrodynamix',
		difficulty: 'Insane',
		officialSongID: 14,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_237_98_40_29_29_29_237_29_29_98_73_177_29_29_29',
	},
	'Hexagon Force': {
		itemType: 'level',
		id: 16,
		stars: 12,
		name: 'Hexagon Force',
		difficulty: 'Insane',
		officialSongID: 15,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_317_73_73_29_29_54_132_29_29_237_132_177_29_29_29',
	},
	'Blast Processing': {
		itemType: 'level',
		id: 17,
		stars: 10,
		name: 'Blast Processing',
		difficulty: 'Harder',
		officialSongID: 16,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_237_29_73_29_29_98_132_29_29_566_54_132_29_29_29',
	},
	'Theory of Everything 2': {
		itemType: 'level',
		id: 18,
		demon: true,
		demonType: 4,
		stars: 14,
		name: 'Theory of Everything 2',
		difficulty: 'Demon',
		officialSongID: 17,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_317_40_54_29_40_132_132_29_29_424_98_237_29_29_29',
		secretCoinsToUnlock: 20,
	},
	'Geometrical Dominator': {
		itemType: 'level',
		id: 19,
		stars: 10,
		name: 'Geometrical Dominator',
		difficulty: 'Harder',
		officialSongID: 18,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_424_132_40_29_29_566_132_29_29_756_237_132_29_73_29',
	},
	Deadlocked: {
		itemType: 'level',
		id: 20,
		demon: true,
		demonType: 4,
		stars: 15,
		name: 'Deadlocked',
		difficulty: 'Demon',
		officialSongID: 19,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
		extraString: '29_317_73_73_29_29_317_424_73_29_566_317_177_29_132_54',
		secretCoinsToUnlock: 30,
	},
	Fingerdash: {
		itemType: 'level',
		id: 21,
		stars: 12,
		name: 'Fingerdash',
		difficulty: 'Insane',
		officialSongID: 20,
		levelType: 'official',
		version: 1,
		totalCoins: 3,
		binaryVersion: 35,
	},
};

const officialLevelOrbs = {
	1: 50,
	2: 75,
	3: 100,
	4: 125,
	5: 150,
	6: 175,
	7: 200,
	8: 225,
	9: 250,
	10: 275,
	11: 300,
	12: 325,
	13: 275,
	14: 500,
	15: 325,
	16: 325,
	17: 275,
	18: 500,
	19: 275,
	20: 500,
	21: 325,
};

export function completeOfficialLevel(save: ReadableSave, coins: boolean, name = 'all') {
	const keys = Object.keys(officialLevels).filter((key) => name === 'all' || key.includes(name));

	if (keys.length === 0) {
		console.error(`No official levels found matching '${name}'.`);
		return;
	}

	for (const key of keys) {
		const level = { ...officialLevels[key as keyof typeof officialLevels] };
		const attempts = randomAttempts(level.difficulty);
		const jumps = randomJumps(level.difficulty, attempts);

		const props: StrObj<Value> = {
			...level,
			attempts,
			jumps,
			seed: randomSeed(),
			leaderboardValid: true,
			percentage: 10,
			manaOrbPercentage: 100,
			leaderboardPercentage: 100,
		};

		if (!save.officialLevels) {
			save.officialLevels = {};
		}

		(save.officialLevels as StrObj<Value>)[`${level.id}`] = props;

		if (!save.officialLevelProgress) {
			save.officialLevelProgress = {};
		}

		(save.officialLevelProgress as StrObj<Value>)[`${level.id}`] = '100';

		if (!save.completedLevels) {
			save.completedLevels = {};
		}

		(save.completedLevels as StrObj<Value>)[`n_${level.id}`] = '1';
		(save.completedLevels as StrObj<Value>)[`star_${level.id}`] = '1';

		if (!save.stats) {
			save.stats = {};
		}

		if (!save.stats.stars) {
			save.stats.stars = 0;
		}

		save.stats.stars += level.stars;

		if (!save.stats.officialLevelsCompleted) {
			save.stats.officialLevelsCompleted = 0;
		}

		save.stats.officialLevelsCompleted++;

		if (!save.stats.orbs) {
			save.stats.orbs = 0;
		}

		save.stats.orbs += officialLevelOrbs[level.id];

		if (!save.stats.totalOrbs) {
			save.stats.totalOrbs = 0;
		}

		save.stats.totalOrbs += officialLevelOrbs[level.id];
	}

	// TODO: Check achievements
}

export function unlockIcon(save: ReadableSave, iconType: IconType | 'all', id: number | 'all') {
	if (!save.unlockedItems) {
		save.unlockedItems = {};
	}

	if (iconType === 'all') {
		for (const info of iconInfo) {
			for (let i = 2; i <= info.total; i++) {
				(save.unlockedItems as StrObj<Value>)[`${info.mappedName}_${i}`] = '1';
			}
		}

		return;
	}

	const iconTypeInfo = iconInfo.find((obj) => obj.type === iconType);

	if (!iconTypeInfo) {
		console.error(`Invalid icon type: ${iconType}`);
		return;
	}

	if (id === 'all') {
		for (let i = 2; i <= iconTypeInfo.total; i++) {
			(save.unlockedItems as StrObj<Value>)[`${iconTypeInfo.mappedName}_${i}`] = '1';
		}

		return;
	}

	if (id < 2 || id > iconTypeInfo.total) {
		console.error(
			`Id out of bounds: for icon type ${iconType}, id must be between 2 and ${iconTypeInfo.total}. Received: ${id}`,
		);
		return;
	}

	(save.unlockedItems as StrObj<Value>)[`${iconTypeInfo.mappedName}_${id}`] = '1';
}

export function unlockGameEvent(save: ReadableSave, value: UnlockableValue) {
	if (!save.unlockValueKeeper) {
		save.unlockValueKeeper = {};
	}

	if (value !== 'all') {
		(save.unlockValueKeeper as StrObj<Value>)[value] = '1';
	}

	for (const key in invGameEvents) {
		(save.unlockValueKeeper as StrObj<Value>)[key] = '1';
	}
}

export function completeMulti(save: ReadableSave, levels: LevelList, coins: boolean) {
	for (const level of levels) {
		const attempts = level.attempts || randomAttempts(level.info.difficulty);
		const jumps = level.jumps || randomJumps(level.info.difficulty, attempts);

		completeLevel(save, level.info, attempts, jumps, coins);
	}
}

export async function completeMapPack(save: ReadableSave, coins: boolean, name = 'all') {
	let cache = getCache('mappack');

	if (Object.keys(cache).length === 0) {
		await buildMapPackCache();
	}

	cache = getCache('mappack');
	const packsToComplete = Object.keys(cache).filter(
		(packId) => name === 'all' || cache[Number(packId)].name.includes(name),
	);

	if (packsToComplete.length === 0) {
		console.error(
			`No map packs found. If you're trying to complete a new map pack, try deleting the map pack cache.`,
		);
		return;
	}

	for (const packId of packsToComplete) {
		const pack = cache[Number(packId)];
		const levels = await Promise.all(pack.levelIds.map(getLevelInfo));
		const goodLevels = levels.filter((level) => typeof level !== 'string') as LevelInfo[];
		levels
			.filter((level) => typeof level === 'string')
			.forEach((error) => console.log(`Error fetching level: ${error}`));

		let completedLevels = 0;

		for (const level of goodLevels) {
			const attempts = randomAttempts(level.difficulty);
			const jumps = randomJumps(level.difficulty, attempts);

			const completedLevel = completeLevel(save, level, attempts, jumps, coins);

			if (completedLevel) {
				completedLevels++;
			}
		}

		if (completedLevels === 3) {
			if (!save.stats) {
				save.stats = {};
			}

			if (!save.stats.mapPacks) {
				save.stats.mapPacks = 0;
			}

			save.stats.mapPacks++;

			if (!save.stats.stars) {
				save.stats.stars = 0;
			}

			save.stats.stars += pack.stars;

			if (!save.stats.coins) {
				save.stats.coins = 0;
			}

			save.stats.coins++;

			if (!save.completedLevels) {
				save.completedLevels = {};
			}

			(save.completedLevels as StrObj<Value>)[`pack_${packId}`] = '1';

			if (!save.mapPackStars) {
				save.mapPackStars = {};
			}

			(save.mapPackStars as StrObj<Value>)[`pack_${packId}`] = pack.stars;
		}
	}

	setAchievements(save, false);
}

export function completeLevel(
	save: ReadableSave,
	level: LevelInfo,
	attempts: number,
	jumps: number,
	coins: boolean,
): boolean {
	// Clicks, bestAttemptTime, and seed need to be faked accurately
	let onlineLevel: StrObj<Value> = {
		itemType: 'level',
		id: parseInt(level.id),
		playable: true,
		attempts,
		jumps,
		percentage: 100,
		practicePercentage: 100,
		manaOrbPercentage: 100,
		leaderboardPercentage: 100,
		leaderboardValid: true,
		scores: '100',
		seed: randomSeed(),
	};

	if (level.stars) {
		onlineLevel.stars = level.stars;
	}

	if (level.difficulty in demonTypesFull) {
		onlineLevel = {
			...onlineLevel,
			demon: true,
			demonType: demonTypesFull[level.difficulty as keyof typeof demonTypesFull],
		};
	}

	if (!save.onlineLevels) {
		save.onlineLevels = {};
	}

	const existingLevel = (save.onlineLevels as StrObj<Value>)[level.id] as StrObj<Value>;

	if (existingLevel && existingLevel['percentage'] === 100) {
		return false;
	}

	(save.onlineLevels as StrObj<Value>)[level.id] = onlineLevel;

	if (!save.levelProgress) {
		save.levelProgress = {};
	}

	(save.levelProgress as StrObj<Value>)[level.id] = '100';

	if (!save.levelStars) {
		save.levelStars = {};
	}

	if (level.stars) {
		(save.levelStars as StrObj<Value>)[level.id] = `${level.stars}`;
	}

	if (!save.completedLevels) {
		save.completedLevels = {};
	}

	(save.completedLevels as StrObj<Value>)[`c_${level.id}`] = '1';
	(save.completedLevels as StrObj<Value>)[`star_${level.id}`] = '1';
	(save.completedLevels as StrObj<Value>)[`demon_${level.id}`] = '1';

	if (!save.stats) {
		save.stats = { stars: 0, orbs: 0, diamonds: 0 };
	}

	if (!save.stats.stars) {
		save.stats.stars = 0;
	}

	if (!save.stats.orbs) {
		save.stats.orbs = 0;
	}

	if (!save.stats.totalOrbs) {
		save.stats.totalOrbs = 0;
	}

	if (!save.stats.jumps) {
		save.stats.jumps = 0;
	}

	if (!save.stats.attempts) {
		save.stats.attempts = 0;
	}

	if (!save.stats.onlineLevelsCompleted) {
		save.stats.onlineLevelsCompleted = 0;
	}

	save.stats.stars += level.stars || 0;
	save.stats.orbs += level.orbs;
	save.stats.totalOrbs += level.orbs;
	save.stats.jumps += jumps;
	save.stats.attempts += attempts;
	save.stats.onlineLevelsCompleted++;

	if (level.difficulty in demonTypesFull) {
		if (!save.stats.demons) {
			save.stats.demons = 0;
		}

		save.stats.demons++;
	}

	if (coins && level.verifiedCoins) {
		if (!save.userCoins) {
			save.userCoins = {};
		}

		for (let i = 0; i < level.coins; i++) {
			(save.userCoins as StrObj<Value>)[`${level.id}_${i + 1}`] = '1';
		}

		if (!save.stats.userCoins) {
			save.stats.userCoins = 0;
		}

		save.stats.userCoins += level.coins;
	}

	// TODO: Update necessary achievements and item unlocks for consistency
	setAchievements(save, false);
	return true;
}

function randomAttempts(difficulty: string): number {
	if (difficulty.includes('Demon')) {
		return Math.floor(randomNormal({ mean: 2200, dev: 325 }));
	}

	return Math.floor(randomNormal({ mean: 250, dev: 50 }));
}

function randomJumps(difficulty: string, attempts: number): number {
	const factor = difficulty.includes('Demon') ? 20 : 10;

	return Math.floor(attempts * randomNormal({ mean: factor, dev: 5 }));
}

function randomSeed(): number {
	return Math.floor(Math.random() * RAND_RANGE + RAND_MIN);
}

export function isUnlockableValue(value: string): value is UnlockableValue {
	return value === 'all' || value in invGameEvents;
}

export function isIconType(type: string): type is IconType {
	return iconInfo.some((obj) => obj.type === type);
}
