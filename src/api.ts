import axios from 'axios';
import { cacheLevel, getCachedLevel, writeCache } from './cache';

export type LevelInfo = {
	name: string;
	id: string;
	description: string;
	author: string;
	playerID: string;
	accountID: string;
	difficulty: string;
	downloads: number;
	likes: number;
	disliked: boolean;
	length: string;
	stars: number;
	orbs: number;
	diamonds: number;
	featured: boolean;
	epic: boolean;
	gameVersion: string;
	editorTime: number;
	totalEditorTime: number;
	version: number;
	copiedID: string;
	twoPlayer: boolean;
	officialSong: number;
	customSong: number;
	coins: number;
	verifiedCoins: boolean;
	starsRequested: number;
	ldm: boolean;
	objects: number;
	large: boolean;
	cp: boolean;
	difficultyFace: string;
	songName: string;
	songAuthor: string;
	songSize: string;
	songID: number;
	songLink: string;
};

export type Difficulty = keyof typeof difficultyMap;
export type DemonDifficulty = keyof typeof demonMap;
export type SearchableDifficulty = Difficulty | DemonDifficulty;

export type SearchQuery = {
	page: number;
	difficulty?: SearchableDifficulty;
	starredOnly?: boolean;
};

const API_URL = 'https://gdbrowser.com/api';
const LEVEL_INFO = '/level';
const SEARCH = '/search';

export const difficultyMap = {
	na: -1,
	auto: -3,
	easy: 1,
	normal: 2,
	hard: 3,
	harder: 4,
	insane: 5,
	demon: -2,
};

export const demonMap = {
	easy_demon: 1,
	medium_demon: 2,
	hard_demon: 3,
	insane_demon: 4,
	extreme_demon: 5,
};

export async function searchLevels(queryObj: SearchQuery): Promise<LevelInfo[] | string> {
	let query = `/*?page=${queryObj.page}`;

	if (queryObj.difficulty) {
		if (isDifficulty(queryObj.difficulty)) {
			query += `&diff=${difficultyMap[queryObj.difficulty]}`;
		} else {
			query += `&diff=${difficultyMap.demon}&demonFilter=${demonMap[queryObj.difficulty]}`;
		}
	}

	if (queryObj.starredOnly) {
		query += `&starred`;
	}

	try {
		const response = await axios.get(`${API_URL}${SEARCH}${query}`);
		const levelInfos = response.data as LevelInfo[];

		for (const info of levelInfos) {
			cacheLevel(info);
		}

		writeCache();

		return levelInfos;
	} catch (error) {
		return `An error occurred: ${error}`;
	}
}

export async function getLevelInfo(levelId: number): Promise<LevelInfo | string> {
	const cached = getCachedLevel(levelId);

	if (cached) {
		return cached;
	}

	try {
		const response = await axios.get(`${API_URL}${LEVEL_INFO}/${levelId}`);
		cacheLevel(response.data);
		writeCache();

		return response.data as LevelInfo;
	} catch (error) {
		return `An error occurred for level ID ${levelId}: ${error}`;
	}
}

function isDifficulty(key: string): key is Difficulty {
	return key in difficultyMap;
}

function isDemonDifficulty(key: string): key is DemonDifficulty {
	return key in demonMap;
}

export function isSearchableDifficulty(key: string): key is SearchableDifficulty {
	return isDifficulty(key) || isDemonDifficulty(key);
}
