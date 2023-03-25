import {
	difficulties,
	gameEvents,
	gKeys,
	kcekKeys,
	lengths,
	levelKeys,
	levelTypes,
	rewardKeys,
	secondaryRewardKeys,
	statKeys,
	StrObj,
} from './keys';

export const invGKeys = invert(gKeys);
export const invStatKeys = invert(statKeys);
export const invLevelKeys = invert(levelKeys);
export const invKcekKeys = toInts(invert(kcekKeys));
export const invDifficulties = invertArray(difficulties);
export const invLevelTypes = invertArray(levelTypes);
export const invLengths = invertArray(lengths);
export const invGameEvents = invert(gameEvents);
export const invRewardKeys = invert(rewardKeys);
export const invSecondaryRewardKeys = invertArrayObj(secondaryRewardKeys);

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

function invertArrayObj(obj: StrObj<string[]>): StrObj<StrObj<number>> {
	const out: StrObj<StrObj<number>> = {};

	for (const key in obj) {
		out[key] = invertArray(obj[key]);
	}

	return out;
}
