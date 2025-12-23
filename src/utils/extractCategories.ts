import type { TextColorOption } from '@/types';

import { categoryRegex } from './constants';
import { parseCamelCase } from './helperFunctions';

interface CategoryWithCount {
	hasCategoryWithoutId: boolean;
	category: string;
	count: number;
}

/**
 * Extracts all the categories from a template's text string and returns them as
 * an array of lowercase strings.
 */
export function extractCategories(text: string) {
	const categories: Set<string> = new Set();
	const wordCount: Record<string, CategoryWithCount> = {};

	const matches = text.matchAll(categoryRegex);
	for (const match of matches) {
		const text = parseCamelCase(match[1]).join(' ').toLowerCase();
		const id = match[2] ?? '';
		const categoryWithId = text + id;

		if (!wordCount[categoryWithId]) {
			wordCount[categoryWithId] = { hasCategoryWithoutId: false, category: text, count: 0 };
		}

		categories.add(text);
		wordCount[categoryWithId].count += 1;
		wordCount[categoryWithId].hasCategoryWithoutId = !!wordCount[text];
	}

	// Get the adjusted count of categories needed to fully generate the story, factoring in the numbered categories
	const adjustedCount: Record<string, number> = {};
	for (const category of categories) {
		const countObjects = Object.values(wordCount).filter(obj => obj.category === category);
		// The base amount to start with is the count of each standalone category
		adjustedCount[category] = wordCount[category]?.count ?? 0;

		// Then only add one for each category with a unique id (number) instead of their individual count
		adjustedCount[category] += countObjects.filter(obj => !obj.hasCategoryWithoutId).length;
	}

	return { categories: Array.from(categories), totalWordsNeeded: adjustedCount };
}

export function extractColorFromWord(word: string): { color: TextColorOption | undefined; word: string } {
	const match = word.match(/([A-z\-\d]+)?\|(.*)/);
	if (!match) {
		return { color: undefined, word };
	}
	return { color: (match[1] as TextColorOption) ?? undefined, word: match[2] };
}
