import { parseCamelCase } from './helperFunctions';

const categoryRegex = /\[([A-z\d ]+?)(:\d)?\]/gm;

export interface Category {
	text: string;
	id?: number;
}

export function extractCategories(text: string): string[] {
	const categories: Set<string> = new Set();

	const matches = text.matchAll(categoryRegex);
	for (const match of matches) {
		const text = parseCamelCase(match[1]).join(' ');
		categories.add(text.toLowerCase());
	}

	return Array.from(categories);
}
