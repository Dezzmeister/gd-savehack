import { LevelInfo } from './api';
import { ReadableSave, StrObj, Value } from './keys';

const RAND_MAX = 2500000;
const RAND_MIN = 50000;
const RAND_RANGE = RAND_MAX - RAND_MIN;

function randomSeed(): number {
	return Math.floor(Math.random() * RAND_RANGE + RAND_MIN);
}

export function completeLevel(save: ReadableSave, level: LevelInfo, attempts: number, jumps: number, coins: boolean) {
	// Clicks, bestAttemptTime, and seed need to be faked accurately
	const onlineLevel = {
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
		stars: level.stars,
		seed: randomSeed(),
	};

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

	(save.levelStars as StrObj<Value>)[level.id] = `${level.stars}`;

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

	save.stats.stars += level.stars;
	save.stats.orbs += level.orbs;

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
