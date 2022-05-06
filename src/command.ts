import fs from 'fs';
import path from 'path';
import { getLevelInfo } from './api';
import { GD_PATH, SaveFile, SAVE_FILES, SAVE_PATHS } from './app';
import { deparseReadableSave } from './deparser';
import { ReadableSave } from './keys';
import { readGDSaveFile } from './parser';
import { completeLevel as doCompleteLevel } from './hacks';

type Command = typeof commands[number];
type CommandMap<T> = {
	[key in Command]: T;
};

const commands = <const>['help', 'backup', 'restore', 'load', 'store', 'get_level', 'complete_level', 'write'];

const currentSaves: {
	[key in SaveFile]?: ReadableSave;
} = {};

const commandSyntaxes: CommandMap<string> = {
	help: 'help',
	backup: 'backup',
	restore: 'restore',
	load: 'load [dir]',
	store: 'store [dir]',
	get_level: 'get_level <id>',
	complete_level: 'complete_level <id> <attempts> <jumps> [coins]',
	write: 'write [dir]',
};

const commandDescriptions: CommandMap<string> = {
	help: 'Display this information',
	backup: 'Back up current save files. Backups will be stored in the same directory as the original saves',
	restore: "Restore backed up save data. Only works if 'backup' was run previously.",
	load: 'Load save files and save them in the current working directory as more readable .json. If a directory is provided, .json saves will be stored in that directory instead.',
	store: 'Transform .json save files back to their original format and store them in the GD save directory. This will replace existing saves. By default, .json saves will be read from the current working directory. If a directory is provided, .json saves will be read from there instead.',
	get_level: 'Get info about a level with the given id. Makes a request to the GDBrowser API.',
	complete_level:
		'Complete the level with the given id. Attempts and jumps are also required. [coins] is an optional boolean that will also give all user coins when set to true, but only if the user coins are verified. Makes a request to the GDBrowser API.',
	write: "Write all changes to active saves to the .json save files. This should be run before running 'store', but after running 'load' and making changes to the save. JSON saves will be written to the given directory, or the current working directory if none is provided.",
};

export async function handleCommand(command: string): Promise<void> {
	const tokens = command.split(' ');
	const operation = tokens[0];

	if (!isCommand(operation)) {
		console.log("Not a valid command; type 'help' for a list of commands");
		return;
	}

	switch (operation) {
		case 'help': {
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
	}
}

function tokenError(paramName: string, type: string) {
	console.error(`Missing expected parameter <${paramName}> with type ${type}`);
}

function writeSaves(dir = '.') {
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

	for (const key in currentSaves) {
		const save = currentSaves[key as keyof typeof currentSaves] as ReadableSave;
		doCompleteLevel(save, data, attempts, jumps, coins);
	}
}

async function getLevel(id: number): Promise<void> {
	const data = await getLevelInfo(id);
	console.log(data);
}

function printHelpInfo() {
	console.log('\n');
	for (const command of commands) {
		console.log(`${commandSyntaxes[command]} - ${commandDescriptions[command]}`);
	}
	console.log('\n');
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
