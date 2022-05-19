import { LevelInfo } from './api';
import fs from 'fs';
import { MapPack } from './keys';

type LevelCache = {
	[id: number]: LevelInfo;
};

type MapPackCache = {
	[id: number]: MapPack;
};

type CacheName = keyof CacheType;
type CacheType = {
	level?: LevelCache;
	mappack?: MapPackCache;
};
type CacheObject<T extends CacheName> = Required<CacheType>[T][keyof Required<CacheType>[T]];
type CacheIdMap = {
	[key in CacheName]: keyof CacheObject<key> & string;
};

type CacheMap<T> = {
	[key in CacheName]: T;
};

const cacheFiles: CacheMap<string> = {
	level: 'levelcache.json',
	mappack: 'mappackcache.json',
};

const cacheIds: CacheIdMap = {
	level: 'id',
	mappack: 'packId',
};

const cache: CacheType = {
	level: undefined,
	mappack: undefined,
};

function loadCache<T extends CacheName>(cacheName: T): CacheType[T] {
	const filename = cacheFiles[cacheName];

	if (!fs.existsSync(filename)) {
		return {};
	}

	const data = fs.readFileSync(filename).toString();
	return JSON.parse(data);
}

export function getCache<T extends CacheName>(cacheName: T): Required<CacheType>[T] {
	if (!cache[cacheName]) {
		cache[cacheName] = loadCache(cacheName);
	}

	return cache[cacheName] as any;
}

export function cacheObject<T extends CacheName>(cacheName: T, obj: CacheObject<T>) {
	if (!cache[cacheName]) {
		cache[cacheName] = loadCache(cacheName);
	}

	const id = parseInt(obj[cacheIds[cacheName]] as any);
	const objCache = cache[cacheName as CacheName];

	if (objCache) {
		objCache[id] = obj as any;
	}
}

export function writeCache<T extends CacheName>(cacheName: T) {
	if (!cache[cacheName]) {
		return;
	}

	fs.writeFileSync(cacheFiles[cacheName], JSON.stringify(cache[cacheName]));
}

export function getCachedObject<T extends CacheName>(cacheName: T, id: number): CacheObject<T> | undefined {
	if (!cache[cacheName]) {
		cache[cacheName] = loadCache(cacheName);
	}

	const objCache = cache[cacheName];
	if (objCache && id in objCache) {
		return objCache[id] as any;
	}
}
