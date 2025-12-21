import type { WordBank } from '@/types';
import { categoryRegex } from '@/utils/constants';

import { pickRandom } from './helperFunctions';

interface ReplacementObject {
	category: string;
	range: number[];
	id?: string;
}

export function getReplacementRanges(text: string, wordbank: WordBank) {
	const categoryReplacementMap: Record<string, ReplacementObject[]> = {};
	const results = text.matchAll(categoryRegex);
	const wordbankCategories = new Set(wordbank.categories);

	for (const match of results) {
		const category = match[1].toLowerCase();
		const id: string | undefined = match[2];
		const categoryKey = category + id;

		console.assert(wordbankCategories.has(category), `Category "%s" is not in the wordbank!`, category);

		categoryReplacementMap[categoryKey] ??= [];
		categoryReplacementMap[categoryKey].push({
			category,
			range: [match.index, match.index + match[0].length],
			id,
		});
	}

	return categoryReplacementMap;
}

export function generateStory(text: string, wordbank: WordBank, replacementMap: Record<string, ReplacementObject[]>) {
	let story = text;

	const sortedReplacementObjects = Object.values(replacementMap)
		.flatMap(arr => arr)
		.sort((a, b) => a.range[0] - b.range[0]);

	const usedWordMap: Record<string, string[]> = {};
	const replacementWordCache: Record<string, string> = {};
	for (const { category, range, id } of [...sortedReplacementObjects].reverse()) {
		usedWordMap[category] ??= [];
		const usedWords = usedWordMap[category];
		const words = wordbank.words[category];

		let wordToReplaceWith: string;
		if (id) {
			const combinedId = category + id;
			if (!replacementWordCache[combinedId]) {
				wordToReplaceWith = pickRandom(words, usedWords);
				replacementWordCache[combinedId] = wordToReplaceWith;
			} else {
				wordToReplaceWith = replacementWordCache[combinedId];
			}
		} else {
			wordToReplaceWith = pickRandom(words, usedWords);
		}

		usedWords.push(wordToReplaceWith);

		story = story.substring(0, range[0]) + wordToReplaceWith + story.substring(range[1]);
	}

	return story;
}
