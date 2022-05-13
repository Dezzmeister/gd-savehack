import randomNormal from 'random-normal';
import { setAchievements } from './achievement';
import { LevelInfo, getLevelInfo } from './api';
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

const mapPackStars = {
	pack_67: '2',
	pack_68: '3',
	pack_69: '3',
	pack_71: '4',
	pack_72: '4',
	pack_73: '4',
	pack_74: '5',
	pack_75: '5',
	pack_76: '5',
	pack_77: '6',
	pack_1: '3',
	pack_2: '4',
	pack_3: '4',
	pack_5: '5',
	pack_6: '6',
	pack_7: '6',
	pack_8: '7',
	pack_9: '8',
	pack_10: '8',
	pack_11: '9',
	pack_22: '10',
	pack_32: '4',
	pack_33: '5',
	pack_35: '8',
	pack_36: '8',
	pack_37: '5',
	pack_38: '5',
	pack_39: '6',
	pack_40: '7',
	pack_41: '8',
	pack_42: '8',
	pack_43: '8',
	pack_44: '9',
	pack_45: '6',
	pack_52: '4',
	pack_53: '3',
	pack_54: '4',
	pack_55: '4',
	pack_56: '5',
	pack_57: '6',
	pack_58: '7',
	pack_59: '8',
	pack_60: '8',
	pack_61: '8',
	pack_62: '9',
	pack_34: '6',
	pack_19: '10',
	pack_20: '10',
	pack_26: '10',
	pack_21: '10',
	pack_27: '10',
	pack_28: '10',
	pack_29: '10',
	pack_30: '10',
	pack_31: '10',
	pack_46: '10',
	pack_47: '10',
	pack_48: '10',
	pack_49: '10',
	pack_50: '10',
	pack_64: '10',
	pack_65: '10',
	pack_66: '10',
	pack_70: '4',
	pack_63: '9',
};

export const mapPackIds = [
	// Alpha pack
	4454123, 11280109, 6508283,

	// Beginner pack
	11940, 150245, 215705,

	// Sapphire pack
	1244147, 1389451, 1642022,

	// Force pack
	10992098, 9110646, 9063899,

	// Cookie pack
	8320596, 2820124, 8477262,

	// Normal pack
	151245, 61757, 150906,

	// Remix pack 1
	59767, 61982, 65106,

	// Stereo pack
	490078, 506009, 513124,

	// UFO pack
	1512012, 1602784, 1649640,

	// Amethyst pack
	1314024, 1629780, 1721197,

	// Ruby pack
	1446958, 1063115, 1734354,

	// Electro pack
	5131543, 8157377, 8571598,

	// Laser pack
	12178580, 11357573, 11591917,

	// GLow pack
	4449079, 6979485, 10110092,

	// Spirit pack
	13766381, 13242284, 13963465,

	// Hard pack
	217631, 3785, 281148,

	// Morph pack
	364445, 411459, 509393,

	// Phoenix pack
	674454, 750434, 835854,

	// Power pack
	809579, 741941, 577710,

	// Shiny pack
	980341, 1541962, 1160937,

	// Ion pack
	8939774, 9204593, 6324840,

	// Blade pack
	7485599, 5017264, 6053464,

	// Sparkle pack
	13912771, 12577409, 11924846,

	// Challenge pack
	167527, 23420, 88737,

	// Remix pack 2
	71485, 77879, 79275,

	// Dash pack
	422703, 460862, 124052,

	// Elemental pack
	819956, 540428, 878743,

	// Fast pack
	856066, 862216, 877915,

	// Color pack
	1001204, 1694003, 1544084,

	// Happy pack
	3382569, 3224853, 3012870,

	// Expert pack
	8612, 131259, 85065,

	// Bionic pack
	714673, 729521, 661286,

	// Warp pack
	1498893, 1123276, 1322487,

	// Remix pack 3
	87960, 116806, 278956,

	// Fusion pack
	269500, 49229, 169590,

	// Turbo pack 1
	461472, 516810, 447766,

	// Turbo pack 2
	456675, 471354, 457265,

	// Shatter pack
	821459, 692596, 745177,

	// Twisted pack
	857195, 687938, 804313,

	// Mortal pack
	827829, 664044, 708901,

	// Cyclone pack
	1566116, 946020, 1100161,

	// Colossus pack
	1350389, 1215630, 1724579,

	// Diamond pack
	1267316, 1670283, 1205277,

	// Chaos pack
	329929, 188909, 340602,

	// Magma pack
	882417, 884256, 551979,

	// Paradox pack
	1447246, 1132530, 1683722,

	// Funky pack
	1728550, 1799065, 1311773,

	// Remix pack 4
	341613, 358750, 369294,

	// Demon pack 1
	70059, 10109, 135561,

	// Demon pack 2
	57730, 308891, 102765,

	// Demon pack 3
	186646, 13519, 55520,

	// Demon pack 4
	199761, 214523, 130414,

	// Demon pack 5
	497514, 380082, 553327,

	// Demon pack 6
	541953, 379772, 449502,

	// Demon pack 7
	511533, 350329, 428765,

	// Demon pack 8
	393159, 456678, 396874,

	// Demon pack 9
	450920, 316982, 436624,

	// Demon pack 10
	874540, 664867, 700880,

	// Demon pack 11
	682941, 897987, 513137,

	// Demon pack 12
	776919, 741635, 735154,

	// Demon pack 13
	764038, 897837, 848722,

	// Demon pack 14
	840397, 413504, 839175,

	// Demon pack 15
	1018758, 1326086, 1698428,

	// Demon pack 16
	1668421, 1703546, 923264,

	// Demon pack 17
	1650666, 1474319, 1777565,
];

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

export async function completeMapPacks(save: ReadableSave, coins: boolean) {
	const promises = mapPackIds.map((levelId) => getLevelInfo(levelId));
	const levels = await Promise.all(promises);

	if (!save.mapPackStars) {
		save.mapPackStars = { ...mapPackStars };
	}

	for (const level of levels) {
		if (typeof level === 'string') {
			console.error(level);
			continue;
		}
		const attempts = randomAttempts(level.difficulty);
		const jumps = randomJumps(level.difficulty, attempts);

		const completedLevel = completeLevel(save, level, attempts, jumps, coins);

		if (completedLevel) {
			// TODO: Update map pack status for every three levels
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
	const factor = difficulty.includes('Demon') ? 100 : 50;

	return Math.floor(attempts * randomNormal({ mean: factor, dev: 20 }));
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
