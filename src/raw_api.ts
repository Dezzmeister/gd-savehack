import axios from 'axios';
import qs from 'querystring';
import { MapPack, mapPackKeys, StrObj } from './keys';

export const RAW_GD_ENDPOINT = 'http://www.boomlings.com/database';

export const constParams = <const>{
	gameVersion: 21,
	binaryVersion: 35,
	gdw: 0,
	secret: 'Wmfd2893gb7',
};

export type ConstParams = typeof constParams;

export type MapPacksRequest = ConstParams & {
	page: number;
};

export type Endpoints = {
	getGJMapPacks21: {
		req: MapPacksRequest;
		res: MapPack[];
	};
};

export type Endpoint = keyof Endpoints;

export type RawRequest = Endpoints[Endpoint]['req'];

export type EndpointMap<T> = {
	[url in Endpoint]: T;
};

const keyMaps: EndpointMap<StrObj<string>> = <const>{
	getGJMapPacks21: mapPackKeys,
};

export async function rawGDRequest<T extends Endpoint>(
	endpoint: T,
	params: Endpoints[T]['req'],
): Promise<Endpoints[T]['res'] | string | null> {
	const url = `${RAW_GD_ENDPOINT}/${endpoint}.php`;
	try {
		const res = await axios({
			method: 'POST',
			headers: {
				'user-agent': '',
				host: 'www.boomlings.com',
				accept: '*/*',
			},
			data: qs.stringify(params),
			url,
		});

		const data = res.data;

		if (
			!data ||
			data === -1 ||
			(typeof data === 'string' && data.startsWith('error')) ||
			typeof data !== 'string'
		) {
			return `An error occurred fetching from ${url}: ${data}`;
		}

		if (typeof data === 'string' && data.startsWith('#')) {
			return null;
		}

		const cleanData = (data as string).substring(0, data.indexOf('#'));

		if (cleanData.includes('|')) {
			return parseArrayResponse<Endpoints[T]['res'][number]>(cleanData, keyMaps[endpoint]);
		}

		return parseObjResponse<Endpoints[T]['res']>(cleanData, keyMaps[endpoint]);
	} catch (err) {
		return `Axios error fetching ${url}: ${err}`;
	}
}

function parseObjResponse<T>(data: string, keyMap?: StrObj<string>): T {
	const tokens = data.split(':');
	const obj: StrObj<string | number | (string | number)[]> = {};

	for (let i = 0; i < tokens.length - 1; i += 2) {
		const rawKey = tokens[i];
		const key = keyMap && rawKey in keyMap ? keyMap[rawKey] : rawKey;
		const val = tokens[i + 1];

		obj[key] = parseVal(val);
	}

	return obj as unknown as T;
}

function parseArrayResponse<T>(data: string, keyMap?: StrObj<string>): T[] {
	const rawElements = data.split('|');
	const out = [];

	for (const rawElement of rawElements) {
		const obj = parseObjResponse(rawElement, keyMap);

		out.push(obj);
	}

	return out as unknown as T[];
}

function parseVal(data: string): string | number | (string | number)[] {
	if (data.includes(',')) {
		return parseArrayVal(data);
	}

	return parseSimpleVal(data);
}

function parseArrayVal(data: string): (string | number)[] {
	const tokens = data.split(',');
	return tokens.map((token) => parseSimpleVal(token));
}

function parseSimpleVal(data: string): string | number {
	const num = Number(data);

	if (isNaN(num)) {
		return data;
	}

	return num;
}
