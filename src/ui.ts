import { Command, CommandMap } from './command';
import { iconInfo } from './hacks';
import { invGameEvents } from './invkeys';

export type FormattedCommand = {
	usage: string;
	description: string;
	details: string;
};

export const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',

	fg: {
		black: '\x1b[30m',
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		white: '\x1b[37m',
	},

	bg: {
		black: '\x1b[40m',
		red: '\x1b[41m',
		green: '\x1b[42m',
		yellow: '\x1b[43m',
		blue: '\x1b[44m',
		magenta: '\x1b[45m',
		cyan: '\x1b[46m',
		white: '\x1b[47m',
	},
};

const commandColor = colors.fg.green;
const argColor = colors.fg.blue;

const commands: CommandMap<FormattedCommand> = {
	help: {
		usage: `${commandColor}help ${argColor}[command]${colors.reset}`,
		description: `List every command, or list details for a single command`,
		details: `List every command, or list details for a single command`,
	},
	backup: {
		usage: `${commandColor}backup${colors.reset}`,
		description: `Back up current save files. Use this before modifying your save to preserve old data in case something goes wrong.`,
		details: `Copies all saves in the game directory and adds a .bak extension. Backups are also stored in the game directory.`,
	},
	restore: {
		usage: `${commandColor}restore${colors.reset}`,
		description: `Restore backed up save data. Only works if ${commandColor}backup${colors.reset} was run previously.`,
		details: `Replaces existing saves in the game directory with .bak files in the game directory of the same name.`,
	},
	load: {
		usage: `${commandColor}load ${argColor}[dir]${colors.reset}`,
		description: `Load save files from the game directory, convert them to more readable json, and save them in the current working directory. If a directory is provided, the .json files will be stored there instead. This command must be run before using edit commands.`,
		details: `Save files in the game directory are decrypted and stored in memory in a more reasonable representation. This command must be run before any edit commands because the edit commands work on the save representations stored in memory, not on any particular file. This command also writes the initial saves to .json files in the same directory as the program (by default), but this directory can be changed by passing another directory.`,
	},
	store: {
		usage: `${commandColor}store ${argColor}[dir]${colors.reset}`,
		description: `Encrypt .json save files in the current working directory and store them in the game directory.`,
		details: `After modifying the .json save files, this command will transform them to a format GD recognizes and store them in the game directory in their original format.`,
	},
	get_level: {
		usage: `${commandColor}get_level ${argColor}<id>${colors.reset}`,
		description: `Get info about a level with the given id. Makes a request to the GDBrowser API.`,
		details: ``,
	},
	complete_level: {
		usage: `${commandColor}complete_level ${argColor}<id> <attempts> <jumps> [coins]${colors.reset}`,
		description: `Complete the level with the given id. Attempts and jumps are also required. [coins] is an optional boolean that will also give all user coins when set to 'true', but only if the user coins are verified. Makes a request to the GDBrowser API.`,
		details: ``,
	},
	write: {
		usage: `${commandColor}write ${argColor}[dir]${colors.reset}`,
		description: `Write any edits to the .json save files in the current working directory, or the directory provided (if given).`,
		details: `Write all changes to active saves to the .json save files. This should be run before running 'store', but after running 'load' and making changes to the save. JSON saves will be written to the given directory, or the current working directory if none is provided.`,
	},
	unlock_value: {
		usage: `${commandColor}unlock_value ${argColor}<value>${colors.reset}`,
		description: `Unlock a player-specific game variable. (Ex: demon keys, treasure room, etc.). 'value' can be either 'all' or one of a list of values. Do 'help unlock_value' for more details.`,
		details: `'value' can be one of:
            \n\t${colors.fg.yellow}all${Object.keys(invGameEvents).map((key) => '\n\t' + key)}${colors.reset}`,
	},
	unlock_icon: {
		usage: `${commandColor}unlock_icon ${argColor}<type> [id]${colors.reset}`,
		description: `Unlock a specific icon, or all icons of a type. If a type is provided but no id, all icons of that type will be unlocked. The type can be one of 'cube', 'ship', 'ball', etc. Do 'help unlock_icon' for more details.`,
		details: `'type' can be one of:
               ${colors.fg.yellow}${iconInfo.map((info) => '\n\t' + info.type)}${colors.reset}`,
	},
	cache_multi: {
		usage: `${commandColor}cache_multi ${argColor}<path>${colors.reset}`,
		description: `Cache level info for a list of levels. <path> should point to a .csv file with an 'id' column containing the ids of levels to be cached. This command will make many requests to the GDBrowser API!`,
		details: `Use this to build up a cache file and avoid making too many requests to the GDBrowser API.`,
	},
	complete_multi: {
		usage: `${commandColor}complete_multi ${argColor}<filename> [coins]${colors.reset}`,
		description: `Complete multiple levels listed in a .csv file. If 'coins' is true, verified user coins will be obtained as well. This command may make many requests to the GDBrowser API if levels are not cached.`,
		details: `The csv file should have an 'id' column with the level IDs, and optional 'attempts' and 'jumps' columns. If these optional columns are not given, attempts and jumps will be generated randomly.`,
	},
};

export function printHelpInfo() {
	console.log(`\n`);
	for (const key in commands) {
		const commandInfo = commands[key as keyof typeof commands];
		console.log(`${commandInfo.usage} - ${commandInfo.description}`);
	}
	console.log(`\n`);
}

export function printCommandInfo(command: Command) {
	const commandInfo = commands[command];
	console.log(`\n${commandInfo.usage} - ${commandInfo.description}\n${commandInfo.details}\n`);
}
