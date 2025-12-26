import type { TextColorOption, WordBank } from '@/types';
import { categoryRegex } from '@/utils/constants';

import { pickRandom, transformWordCategory } from './helperFunctions';

interface ReplacementObject {
	category: string;
	range: number[];
	id?: string;
}

export function generateStory(text: string, wordbank: WordBank) {
	let story = text;

	const replacementMap = getReplacementRanges(text, wordbank);
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

		story =
			story.substring(0, range[0]) +
			// TODO: make word color dynamic
			getWordWithPrependedColor(wordToReplaceWith, 'celery') +
			story.substring(range[1]);
	}

	return story;
}

function getReplacementRanges(text: string, wordbank: WordBank) {
	const categoryReplacementMap: Record<string, ReplacementObject[]> = {};
	const results = text.matchAll(categoryRegex);
	const wordbankCategories = new Set(wordbank.categories);

	for (const match of results) {
		const category = transformWordCategory(match[1]);
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

function getWordWithPrependedColor(word: string, color?: TextColorOption) {
	return color ? `\`${color}|${word}\`` : `\`${word}\``;
}
