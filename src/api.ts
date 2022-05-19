import axios from 'axios';
import { cacheObject, getCachedObject, writeCache } from './cache';
import { MapPack } from './keys';
import { constParams, rawGDRequest } from './raw_api';

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
			cacheObject('level', info);
		}

		writeCache('level');

		return levelInfos;
	} catch (error) {
		return `An error occurred: ${error}`;
	}
}

export async function buildMapPackCache() {
	let page = 0;
	const packs: MapPack[] = [];

	while (page < 8) {
		const res = await rawGDRequest('getGJMapPacks21', { ...constParams, page });

		if (typeof res === 'string') {
			console.error(res);
			page++;
			continue;
		}

		if (res === null) {
			break;
		}

		packs.push(...res);

		page++;
	}
	packs.forEach((pack) => cacheObject('mappack', pack));
	writeCache('mappack');
}

export async function getLevelInfo(levelId: number): Promise<LevelInfo | string> {
	const cached = getCachedObject('level', levelId);

	if (cached) {
		return cached;
	}

	try {
		const response = await axios.get(`${API_URL}${LEVEL_INFO}/${levelId}`);
		cacheObject('level', response.data);
		writeCache('level');

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
