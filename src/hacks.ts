import { LevelInfo } from './api';
import { invGameEvents } from './invkeys';
import { demonTypesFull, GameEvent, ReadableSave, StrObj, Value } from './keys';

export type UnlockableValue = 'all' | GameEvent;
export type IconType = typeof iconInfo[number]['type'];

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
];

export type LevelList = {
	id: number;
	attempts?: number;
	jumps?: number;
	coins?: boolean;
}[];

export function unlockIcon(save: ReadableSave, iconType: IconType, id: number | 'all') {
	const iconTypeInfo = iconInfo.find((obj) => obj.type === iconType);

	if (!iconTypeInfo) {
		console.error(`Invalid icon type: ${iconType}`);
		return;
	}

	if (!save.unlockedItems) {
		save.unlockedItems = {};
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

export function completeLevel(save: ReadableSave, level: LevelInfo, attempts: number, jumps: number, coins: boolean) {
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

	if (!save.stats.jumps) {
		save.stats.jumps = 0;
	}

	if (!save.stats.attempts) {
		save.stats.attempts = 0;
	}

	save.stats.stars += level.stars || 0;
	save.stats.orbs += level.orbs;
	save.stats.jumps += jumps;
	save.stats.attempts += attempts;

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
