import axios from 'axios';

const API_URL = 'https://gdbrowser.com/api';
const LEVEL_INFO = '/level';

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

export async function getLevelInfo(levelId: number): Promise<LevelInfo> {
	const response = await axios.get(`${API_URL}${LEVEL_INFO}/${levelId}`);

	return response.data as LevelInfo;
}
