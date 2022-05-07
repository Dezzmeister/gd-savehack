import { LevelInfo } from './api';
import fs from 'fs';

type Cache = {
	[id: number]: LevelInfo;
};

const CACHE_FILE = 'levelcache.json';
let cache: Cache | undefined;

function loadCache(): Cache {
	if (!fs.existsSync(CACHE_FILE)) {
		return {};
	}

	const data = fs.readFileSync(CACHE_FILE).toString();
	return JSON.parse(data);
}

export function getCache(): Cache {
	if (!cache) {
		cache = loadCache();
	}

	return cache;
}

export function cacheLevel(level: LevelInfo) {
	if (!cache) {
		cache = loadCache();
	}

	const id = parseInt(level.id);
	cache[id] = level;
}

export function writeCache() {
	if (!cache) {
		return;
	}

	fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

export function flushCache(id: number | 'all') {
	if (!cache) {
		cache = loadCache();
	}

	if (id === 'all') {
		cache = {};
		return;
	}

	delete cache[id];
}

export function getCachedLevel(id: number): LevelInfo | undefined {
	if (!cache) {
		cache = loadCache();
	}

	if (id in cache) {
		return cache[id];
	}
}
