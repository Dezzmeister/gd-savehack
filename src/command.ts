import fs from 'fs';
import path from 'path';
import { getLevelInfo } from './api';
import { GD_PATH, SaveFile, SAVE_FILES, SAVE_PATHS } from './app';
import { deparseReadableSave } from './deparser';
import { ReadableSave } from './keys';
import { readGDSaveFile } from './parser';
import {
	completeLevel as doCompleteLevel,
	completeMulti as doCompleteMulti,
	unlockIcon as doUnlockIcon,
	isUnlockableValue,
	unlockGameEvent,
	isIconType,
	IconType,
	LevelList,
} from './hacks';
import { printCommandInfo, printHelpInfo } from './ui';
import { isLevelCSV, parseCSV } from './list';
import { cacheLevel, writeCache } from './cache';

export type Command = typeof commands[number];
export type CommandMap<T> = {
	[key in Command]: T;
};

const commands = <const>[
	'help',
	'backup',
	'restore',
	'load',
	'store',
	'get_level',
	'complete_level',
	'write',
	'unlock_value',
	'unlock_icon',
	'cache_multi',
	'complete_multi',
];

const currentSaves: {
	[key in SaveFile]?: ReadableSave;
} = {};

export async function handleCommand(command: string): Promise<void> {
	const tokens = command.split(' ');
	const operation = tokens[0];

	if (!isCommand(operation)) {
		console.log("Not a valid command; type 'help' for a list of commands");
		return;
	}

	switch (operation) {
		case 'help': {
			const commandArg = tokens[1];

			if (isCommand(commandArg)) {
				printCommandInfo(commandArg);
				return;
			}

			printHelpInfo();
			return;
		}
		case 'backup': {
			backupSaves();
			return;
		}
		case 'restore': {
			restoreBackups();
			return;
		}
		case 'load': {
			loadSaves(tokens[1]);
			return;
		}
		case 'store': {
			storeSaves(tokens[1]);
			return;
		}
		case 'get_level': {
			const levelId = parseInt(tokens[1]);
			if (!tokens[1] || isNaN(levelId)) {
				return tokenError('id', 'int');
			}

			await getLevel(levelId);
			return;
		}
		case 'complete_level': {
			const levelId = parseInt(tokens[1]);
			const attempts = parseInt(tokens[2]);
			const jumps = parseInt(tokens[3]);
			const coins = tokens[4] === 'true' ? true : false;

			if (!tokens[1] || isNaN(levelId)) {
				return tokenError('id', 'int');
			}

			if (!tokens[2] || isNaN(attempts)) {
				return tokenError('attempts', 'int');
			}

			if (!tokens[3] || isNaN(jumps)) {
				return tokenError('jumps', 'int');
			}

			await completeLevel(levelId, attempts, jumps, coins);
			return;
		}
		case 'write': {
			writeSaves(tokens[1]);
			return;
		}
		case 'unlock_value': {
			const value = tokens[1];

			if (!value) {
				return tokenError('value', 'string');
			}

			unlockValue(value);
			return;
		}
		case 'unlock_icon': {
			const iconType = tokens[1];
			const id = parseInt(tokens[2]);

			if (!isIconType(iconType)) {
				console.error(`Invalid icon type: ${iconType}. Do 'help unlock_icon' for more info.`);
				return;
			}

			if (tokens[2] !== undefined && isNaN(id)) {
				console.error(`Invalid id. Do 'help unlock_icon' for more info.`);
				return;
			}

			unlockIcon(iconType, tokens[2] === undefined ? 'all' : id);
			return;
		}
		case 'cache_multi': {
			const filename = tokens[1];

			if (!filename) {
				return tokenError('path', 'string');
			}

			await cacheMulti(filename);
			return;
		}
		case 'complete_multi': {
			const filename = tokens[1];
			const coins = tokens[2] === 'true' ? true : false;

			if (!filename) {
				return tokenError('path', 'string');
			}

			await completeMulti(filename, coins);
			return;
		}
	}
}

async function completeMulti(filename: string, coins: boolean) {
	const file = fs.readFileSync(filename).toString();
	const csv = parseCSV(file);
	if (!isLevelCSV(csv)) {
		console.error(`Invalid CSV file`);
		return;
	}

	const levelList: LevelList = [];

	for (const level of csv) {
		const info = await getLevelInfo(level.id);

		if (typeof info === 'string') {
			console.error(`Error for level ${level.id}: ${info}`);
			continue;
		}

		levelList.push({ ...level, info });
	}

	for (const key in currentSaves) {
		const save = currentSaves[key as keyof typeof currentSaves] as ReadableSave;
		doCompleteMulti(save, levelList, coins);
	}
}

async function cacheMulti(filename: string) {
	const file = fs.readFileSync(filename).toString();
	const csv = parseCSV(file);
	if (!isLevelCSV(csv)) {
		console.error(`Invalid CSV file`);
		return;
	}

	for (const datum of csv) {
		const id = datum.id;

		const levelData = await getLevelInfo(id);

		if (typeof levelData === 'string') {
			console.log(`Error for level ${id}: ${levelData}`);
			continue;
		}

		cacheLevel(levelData);
	}

	writeCache();
}

function unlockIcon(iconType: IconType, id: number | 'all') {
	for (const key in currentSaves) {
		const save = currentSaves[key as keyof typeof currentSaves] as ReadableSave;
		doUnlockIcon(save, iconType, id);
	}
}

function unlockValue(value: string): void {
	if (Object.keys(currentSaves).length === 0) {
		console.error("You need to have at least one active save for this to work. Do 'load' or 'help' for more info.");
		return;
	}

	if (!isUnlockableValue(value)) {
		console.error(
			`Expected unlockable value, received '${value}' instead. Do 'help unlock_value' for more details.`,
		);
		return;
	}

	for (const key in currentSaves) {
		const save = currentSaves[key as keyof typeof currentSaves] as ReadableSave;
		unlockGameEvent(save, value);
	}
}

function writeSaves(dir = '.') {
	if (Object.keys(currentSaves).length === 0) {
		console.error("You need to have at least one active save for this to work. Do 'load' or 'help' for more info.");
		return;
	}

	for (const filename of SAVE_FILES) {
		const save = currentSaves[filename] as ReadableSave;
		fs.writeFileSync(path.join(dir, `${filename}.json`), JSON.stringify(save));
	}
}

async function completeLevel(id: number, attempts: number, jumps: number, coins: boolean): Promise<void> {
	if (Object.keys(currentSaves).length === 0) {
		console.error("You need to have at least one active save for this to work. Do 'load' or 'help' for more info.");
		return;
	}

	const data = await getLevelInfo(id);

	if (typeof data === 'string') {
		console.error(data);
		return;
	}

	for (const key in currentSaves) {
		const save = currentSaves[key as keyof typeof currentSaves] as ReadableSave;
		doCompleteLevel(save, data, attempts, jumps, coins);
	}
}

async function getLevel(id: number): Promise<void> {
	const data = await getLevelInfo(id);
	console.log(data);
}

function backupSaves() {
	for (const path of SAVE_PATHS) {
		fs.copyFileSync(path, `${path}.bak`);
	}
}

function restoreBackups() {
	for (const path of SAVE_PATHS) {
		fs.copyFileSync(`${path}.bak`, path);
	}
}

function storeSaves(dir = '.') {
	for (const filename of SAVE_FILES) {
		const destPath = path.join(GD_PATH || '', filename);
		const buf = fs.readFileSync(path.join(dir, `${filename}.json`));
		const readableSave = JSON.parse(buf.toString()) as ReadableSave;
		const rawSave = deparseReadableSave(readableSave);
		fs.writeFileSync(destPath, rawSave);
	}
}

function loadSaves(dir = '.') {
	for (const filename of SAVE_FILES) {
		const fullpath = path.join(GD_PATH || '', filename);
		const buf = fs.readFileSync(fullpath);
		const json = readGDSaveFile(buf);

		currentSaves[filename] = json;
		fs.writeFileSync(path.join(dir, `${filename}.json`), JSON.stringify(json));
	}
}

function isCommand(command: string): command is Command {
	return !!command && commands.includes(command as Command);
}

function tokenError(paramName: string, type: string) {
	console.error(`Invalid or missing required parameter <${paramName}> with type ${type}`);
}
