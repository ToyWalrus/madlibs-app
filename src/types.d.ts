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
}
