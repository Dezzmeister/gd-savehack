import { StrObj } from './keys';

export type CSVData = {
	[column: string]: string | number;
}[];

export type LevelCSV = {
	id: number;
	attempts?: number;
	jumps?: number;
}[];

export function parseCSV(csv: string): CSVData | undefined {
	const lines = csv.replace(/\r/g, '').split('\n');
	const columns = lines[0].split(',');
	const out: CSVData = [];

	for (let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
		const row = lines[rowIndex].split(',');

		if (row.length !== columns.length) {
			console.error(`Invalid CSV: Line ${rowIndex}`);
			return;
		}

		const datum: StrObj<string | number> = {};
		for (let col = 0; col < columns.length; col++) {
			const maybeNum = Number(row[col]);

			if (isNaN(maybeNum)) {
				datum[columns[col]] = row[col];
			} else {
				datum[columns[col]] = maybeNum;
			}
		}
		out.push(datum);
	}

	return out;
}

export function isLevelCSV(csv: CSVData | undefined): csv is LevelCSV {
	if (!csv) {
		return false;
	}

	for (const datum of csv) {
		if (!('id' in datum)) {
			return false;
		}

		if (typeof datum.id !== 'number') {
			return false;
		}

		if ('attempts' in datum && typeof datum.attempts !== 'number') {
			return false;
		}

		if ('jumps' in datum && typeof datum.jumps !== 'number') {
			return false;
		}
	}

	return true;
}
