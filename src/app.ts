import path from 'path';
import readlineSync from 'readline-sync';
import { searchLevels } from './api';
import { handleCommand } from './command';

export const SAVE_FILES = <const>['CCGameManager.dat', 'CCGameManager2.dat'];
export type SaveFile = typeof SAVE_FILES[number];

const LOCAL_APPDATA = process.env.LOCALAPPDATA;
export const GD_PATH = LOCAL_APPDATA ? path.join(LOCAL_APPDATA, 'GeometryDash') : undefined;
export const SAVE_PATHS = SAVE_FILES.map((filename) => path.join(GD_PATH || '', filename));

async function main() {
	let input = '';
	console.log("Enter a command, or 'help' for help");

	await searchLevels({
		page: 1,
		difficulty: 'insane_demon',
		starredOnly: true,
	});

	while ((input = readlineSync.question('> ')) !== 'quit') {
		await handleCommand(input);
	}
}

main();
