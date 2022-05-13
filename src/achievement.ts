import { iconInfo } from './hacks';
import { ReadableSave, StatName, StrObj, Value } from './keys';

// Floored percentage for collectibles like user coins and stars

export type Unlockable = `${typeof iconInfo[number]['mappedName']}_${number}`;

export type AchievementName<T extends AchievementCategory> = `geometry.ach.${T}${number}`;

export type AchievementCategory = 'usercoins' | 'stars' | 'jump' | 'attempt' | 'custom' | 'demon';

export type AchievementMap<T extends AchievementCategory> = {
	[achievement in AchievementName<T>]: {
		set: (save: ReadableSave) => number;
		unlocks: Unlockable;
	};
};

export const userCoinsAchMap: AchievementMap<'usercoins'> = {
	'geometry.ach.usercoins01': {
		set: (save) => getPercentage(save, 'userCoins', 1),
		unlocks: `dart_2`,
	},
	'geometry.ach.usercoins02': {
		set: (save) => getPercentage(save, 'userCoins', 10),
		unlocks: `i_49`,
	},
	'geometry.ach.usercoins03': {
		set: (save) => getPercentage(save, 'userCoins', 20),
		unlocks: `dart_4`,
	},
	'geometry.ach.usercoins04': {
		set: (save) => getPercentage(save, 'userCoins', 30),
		unlocks: `ship_25`,
	},
	'geometry.ach.usercoins05': {
		set: (save) => getPercentage(save, 'userCoins', 40),
		unlocks: `ball_16`,
	},
	'geometry.ach.usercoins06': {
		set: (save) => getPercentage(save, 'userCoins', 50),
		unlocks: `bird_13`,
	},
	'geometry.ach.usercoins07': {
		set: (save) => getPercentage(save, 'userCoins', 60),
		unlocks: `i_53`,
	},
	'geometry.ach.usercoins08': {
		set: (save) => getPercentage(save, 'userCoins', 70),
		unlocks: `dart_6`,
	},
	'geometry.ach.usercoins09': {
		set: (save) => getPercentage(save, 'userCoins', 80),
		unlocks: `ship_23`,
	},
	'geometry.ach.usercoins10': {
		set: (save) => getPercentage(save, 'userCoins', 90),
		unlocks: `ball_17`,
	},
	'geometry.ach.usercoins11': {
		set: (save) => getPercentage(save, 'userCoins', 100),
		unlocks: `robot_6`,
	},
	'geometry.ach.usercoins12': {
		set: (save) => getPercentage(save, 'userCoins', 110),
		unlocks: `i_54`,
	},
	'geometry.ach.usercoins13': {
		set: (save) => getPercentage(save, 'userCoins', 120),
		unlocks: `dart_7`,
	},
	'geometry.ach.usercoins14': {
		set: (save) => getPercentage(save, 'userCoins', 130),
		unlocks: `ship_21`,
	},
	'geometry.ach.usercoins15': {
		set: (save) => getPercentage(save, 'userCoins', 140),
		unlocks: `ball_11`,
	},
	'geometry.ach.usercoins16': {
		set: (save) => getPercentage(save, 'userCoins', 150),
		unlocks: `i_52`,
	},
	'geometry.ach.usercoins17': {
		set: (save) => getPercentage(save, 'userCoins', 160),
		unlocks: `bird_17`,
	},
	'geometry.ach.usercoins18': {
		set: (save) => getPercentage(save, 'userCoins', 170),
		unlocks: `dart_10`,
	},
	'geometry.ach.usercoins19': {
		set: (save) => getPercentage(save, 'userCoins', 180),
		unlocks: `ship_22`,
	},
	'geometry.ach.usercoins20': {
		set: (save) => getPercentage(save, 'userCoins', 190),
		unlocks: `ball_18`,
	},
	'geometry.ach.usercoins21': {
		set: (save) => getPercentage(save, 'userCoins', 200),
		unlocks: `robot_4`,
	},
	'geometry.ach.usercoins22': {
		set: (save) => getPercentage(save, 'userCoins', 225),
		unlocks: `i_99`,
	},
	'geometry.ach.usercoins23': {
		set: (save) => getPercentage(save, 'userCoins', 250),
		unlocks: `c0_37`,
	},
	'geometry.ach.usercoins24': {
		set: (save) => getPercentage(save, 'userCoins', 300),
		unlocks: `spider_8`,
	},
	'geometry.ach.usercoins25': {
		set: (save) => getPercentage(save, 'userCoins', 350),
		unlocks: `c0_22`,
	},
	'geometry.ach.usercoins26': {
		set: (save) => getPercentage(save, 'userCoins', 425),
		unlocks: `ball_29`,
	},
	'geometry.ach.usercoins27': {
		set: (save) => getPercentage(save, 'userCoins', 500),
		unlocks: `i_93`,
	},
	'geometry.ach.usercoins28': {
		set: (save) => getPercentage(save, 'userCoins', 600),
		unlocks: `dart_22`,
	},
	'geometry.ach.usercoins29': {
		set: (save) => getPercentage(save, 'userCoins', 700),
		unlocks: `robot_15`,
	},
	'geometry.ach.usercoins30': {
		set: (save) => getPercentage(save, 'userCoins', 800),
		unlocks: `ship_33`,
	},
	'geometry.ach.usercoins31': {
		set: (save) => getPercentage(save, 'userCoins', 900),
		unlocks: `ball_28`,
	},
	'geometry.ach.usercoins32': {
		set: (save) => getPercentage(save, 'userCoins', 1000),
		unlocks: `bird_28`,
	},
};

export const starsAchMap: AchievementMap<'stars'> = {
	'geometry.ach.stars01': {
		set: (save) => getPercentage(save, 'stars', 100),
		unlocks: `i_23`,
	},
	'geometry.ach.stars02': {
		set: (save) => getPercentage(save, 'stars', 200),
		unlocks: `i_24`,
	},
	'geometry.ach.stars03': {
		set: (save) => getPercentage(save, 'stars', 300),
		unlocks: `i_25`,
	},
	'geometry.ach.stars04': {
		set: (save) => getPercentage(save, 'stars', 400),
		unlocks: `i_26`,
	},
	'geometry.ach.stars05': {
		set: (save) => getPercentage(save, 'stars', 500),
		unlocks: `ship_4`,
	},
	'geometry.ach.stars06': {
		set: (save) => getPercentage(save, 'stars', 600),
		unlocks: `ship_5`,
	},
	'geometry.ach.stars07': {
		set: (save) => getPercentage(save, 'stars', 700),
		unlocks: `ship_7`,
	},
	'geometry.ach.stars08': {
		set: (save) => getPercentage(save, 'stars', 800),
		unlocks: `i_28`,
	},
	'geometry.ach.stars09': {
		set: (save) => getPercentage(save, 'stars', 900),
		unlocks: `i_29`,
	},
	'geometry.ach.stars10': {
		set: (save) => getPercentage(save, 'stars', 1000),
		unlocks: `i_30`,
	},
	'geometry.ach.stars11': {
		set: (save) => getPercentage(save, 'stars', 1500),
		unlocks: `ship_18`,
	},
	'geometry.ach.stars12': {
		set: (save) => getPercentage(save, 'stars', 2000),
		unlocks: `ball_9`,
	},
	'geometry.ach.stars13': {
		set: (save) => getPercentage(save, 'stars', 2500),
		unlocks: `dart_12`,
	},
	'geometry.ach.stars14': {
		set: (save) => getPercentage(save, 'stars', 3000),
		unlocks: `i_61`,
	},
	'geometry.ach.stars15': {
		set: (save) => getPercentage(save, 'stars', 3500),
		unlocks: `ship_19`,
	},
	'geometry.ach.stars16': {
		set: (save) => getPercentage(save, 'stars', 4000),
		unlocks: `dart_9`,
	},
	'geometry.ach.stars17': {
		set: (save) => getPercentage(save, 'stars', 4500),
		unlocks: `dart_15`,
	},
	'geometry.ach.stars18': {
		set: (save) => getPercentage(save, 'stars', 5000),
		unlocks: `c0_23`,
	},
	'geometry.ach.stars19': {
		set: (save) => getPercentage(save, 'stars', 5500),
		unlocks: `i_82`,
	},
	'geometry.ach.stars20': {
		set: (save) => getPercentage(save, 'stars', 6000),
		unlocks: `ball_27`,
	},
	'geometry.ach.stars21': {
		set: (save) => getPercentage(save, 'stars', 6500),
		unlocks: `c0_28`,
	},
	'geometry.ach.stars22': {
		set: (save) => getPercentage(save, 'stars', 7000),
		unlocks: `ship_30`,
	},
	'geometry.ach.stars23': {
		set: (save) => getPercentage(save, 'stars', 7500),
		unlocks: `i_100`,
	},
	'geometry.ach.stars24': {
		set: (save) => getPercentage(save, 'stars', 8000),
		unlocks: `spider_4`,
	},
	'geometry.ach.stars25': {
		set: (save) => getPercentage(save, 'stars', 9000),
		unlocks: `i_83`,
	},
	'geometry.ach.stars26': {
		set: (save) => getPercentage(save, 'stars', 10000),
		unlocks: `robot_8`,
	},
};

export const jumpAchMap: AchievementMap<'jump'> = {
	'geometry.ach.jump01': {
		set: (save) => getPercentage(save, 'jumps', 1000),
		unlocks: `c1_07`,
	},
	'geometry.ach.jump02': {
		set: (save) => getPercentage(save, 'jumps', 10000),
		unlocks: `c1_16`,
	},
	'geometry.ach.jump03': {
		set: (save) => getPercentage(save, 'jumps', 20000),
		unlocks: `c1_17`,
	},
	'geometry.ach.jump04': {
		set: (save) => getPercentage(save, 'jumps', 50000),
		unlocks: `bird_5`,
	},
	'geometry.ach.jump05': {
		set: (save) => getPercentage(save, 'jumps', 100000),
		unlocks: `ball_13`,
	},
};

export const attemptAchMap: AchievementMap<'attempt'> = {
	'geometry.ach.attempt01': {
		set: (save) => getPercentage(save, 'attempts', 100),
		unlocks: `c1_08`,
	},
	'geometry.ach.attempt02': {
		set: (save) => getPercentage(save, 'attempts', 500),
		unlocks: `c1_10`,
	},
	'geometry.ach.attempt03': {
		set: (save) => getPercentage(save, 'attempts', 2000),
		unlocks: `c1_15`,
	},
	'geometry.ach.attempt04': {
		set: (save) => getPercentage(save, 'attempts', 10000),
		unlocks: `c1_18`,
	},
	'geometry.ach.attempt05': {
		set: (save) => getPercentage(save, 'attempts', 20000),
		unlocks: `dart_3`,
	},
};

export const onlineLevelAchMap: AchievementMap<'custom'> = {
	'geometry.ach.custom01': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 1),
		unlocks: `c0_16`,
	},
	'geometry.ach.custom02': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 10),
		unlocks: `i_12`,
	},
	'geometry.ach.custom03': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 50),
		unlocks: `i_36`,
	},
	'geometry.ach.custom04': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 100),
		unlocks: `ship_13`,
	},
	'geometry.ach.custom05': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 200),
		unlocks: `c0_40`,
	},
	'geometry.ach.custom06': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 300),
		unlocks: `i_40`,
	},
	'geometry.ach.custom07': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 500),
		unlocks: `ship_15`,
	},
	'geometry.ach.custom08': {
		set: (save) => getPercentage(save, 'onlineLevelsCompleted', 1000),
		unlocks: `ship_17`,
	},
};

export const demonAchMap: AchievementMap<'demon'> = {
	'geometry.ach.demon01': {
		set: (save) => getPercentage(save, 'demons', 1),
		unlocks: `i_19`,
	},
	'geometry.ach.demon02': {
		set: (save) => getPercentage(save, 'demons', 2),
		unlocks: `i_20`,
	},
	'geometry.ach.demon03': {
		set: (save) => getPercentage(save, 'demons', 3),
		unlocks: `i_21`,
	},
	'geometry.ach.demon04': {
		set: (save) => getPercentage(save, 'demons', 4),
		unlocks: `i_22`,
	},
	'geometry.ach.demon05': {
		set: (save) => getPercentage(save, 'demons', 5),
		unlocks: `ship_3`,
	},
	'geometry.ach.demon06': {
		set: (save) => getPercentage(save, 'demons', 10),
		unlocks: `ship_6`,
	},
	'geometry.ach.demon07': {
		set: (save) => getPercentage(save, 'demons', 15),
		unlocks: `ship_8`,
	},
	'geometry.ach.demon08': {
		set: (save) => getPercentage(save, 'demons', 20),
		unlocks: `ball_5`,
	},
	'geometry.ach.demon09': {
		set: (save) => getPercentage(save, 'demons', 30),
		unlocks: `i_37`,
	},
	'geometry.ach.demon10': {
		set: (save) => getPercentage(save, 'demons', 40),
		unlocks: `ball_10`,
	},
	'geometry.ach.demon11': {
		set: (save) => getPercentage(save, 'demons', 50),
		unlocks: `bird_15`,
	},
	'geometry.ach.demon12': {
		set: (save) => getPercentage(save, 'demons', 60),
		unlocks: `ship_35`,
	},
};

export const achievementMap: AchievementMap<AchievementCategory> = {
	...userCoinsAchMap,
	...starsAchMap,
	...jumpAchMap,
	...attemptAchMap,
	...onlineLevelAchMap,
	...demonAchMap,
};

export function setAchievements(save: ReadableSave, forceUnlocks = false) {
	if (!save.achievements) {
		save.achievements = {};
	}

	if (!save.unlockedItems) {
		save.unlockedItems = {};
	}

	for (const achievement in achievementMap) {
		const { set, unlocks } = achievementMap[achievement as AchievementName<AchievementCategory>];
		const achVal = set(save);

		if (achVal >= 100) {
			(save.unlockedItems as StrObj<Value>)[unlocks] = '1';
		} else if (forceUnlocks) {
			delete (save.unlockedItems as StrObj<Value>)[unlocks];
		}

		(save.achievements as StrObj<string>)[achievement] = `${achVal}`;
	}
}

function getPercentage(save: ReadableSave, stat: StatName, expected: number): number {
	if (!save.stats) {
		save.stats = {};
	}

	const val = save.stats[stat] !== undefined ? (save.stats[stat] as number) : 0;

	return Math.floor(100 * (val / expected));
}
