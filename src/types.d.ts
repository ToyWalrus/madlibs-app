export interface Template {
	title: string;
	text: string;
	shareId: string;
}

export interface WordBank<const T extends readonly string[] = string[]> {
	categories: T;
	words: {
		[K in T[number]]: string[];
	};
	totalWordsNeeded?: {
		[K in T[number]]: number;
	};
}

export type TextColorOption =
	| 'gray'
	| 'red'
	| 'orange'
	| 'yellow'
	| 'chartreuse'
	| 'celery'
	| 'green'
	| 'seafoam'
	| 'cyan'
	| 'blue'
	| 'indigo'
	| 'purple'
	| 'fuchsia'
	| 'magenta';
