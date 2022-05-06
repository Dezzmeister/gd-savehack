import { difficulties, gKeys, kcekKeys, lengths, levelKeys, levelTypes, statKeys, StrObj } from './keys';

export const invGKeys = invert(gKeys);
export const invStatKeys = invert(statKeys);
export const invLevelKeys = invert(levelKeys);
export const invKcekKeys = toInts(invert(kcekKeys));
export const invDifficulties = invertArray(difficulties);
export const invLevelTypes = invertArray(levelTypes);
export const invLengths = invertArray(lengths);

function toInts(obj: StrObj<string>): StrObj<number> {
	const out: StrObj<number> = {};

	for (const key in obj) {
		out[key] = parseInt(obj[key]);
	}

	return out;
}

function invert(obj: StrObj<string>): StrObj<string> {
	const out: StrObj<string> = {};

	for (const key in obj) {
		const val = obj[key];
		out[val] = key;
	}

	return out;
}

function invertArray(arr: readonly string[]): StrObj<number> {
	const out: StrObj<number> = {};

	for (let i = 0; i < arr.length; i++) {
		out[arr[i]] = i;
	}

	return out;
}

/*
function invertLevelKeys(obj: typeof levelKeys): StrObj<Value> {
	const out: StrObj<Value> = {};

	for (const key in obj) {
		const val = obj[key as keyof typeof obj];
		if (typeof val === 'string') {
			out[val] = key;
			continue;
		}

		if (!('bump' in val)) {
			out[val.name] = { name: key };
			continue;
		}

		const invBump: StrObj<number> = {};
		for (let i = 0; i < val.bump.length; i++) {
			invBump[val.bump[i]] = i;
		}

		out[val.name] = { name: key, bump: invBump };
	}

	return out;
}
*/
// TODO: Maybe make this const
