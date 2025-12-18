import type { WordBank } from '@/types';

/**
 * Capitalizes a string.
 *
 * @example
 * capitalize('my string') -> 'My string'
 */
export function capitalize(str?: string) {
	if (!str) return '';
	return str.substring(0, 1).toUpperCase() + str.substring(1);
}

/**
 * Parses a camelCase string into an array containing all the parts
 * of the string, split before the capital letters.
 *
 * @example
 * parseCamelCase('aSimpleName') -> ['a', 'Simple', 'Name']
 */
export function parseCamelCase(str: string) {
	const parts: string[] = [];
	let prevIdx = 0;

	const regex = /[A-Z]/g;
	let result: RegExpExecArray | null;
	while ((result = regex.exec(str))) {
		parts.push(str.substring(prevIdx, result.index));
		prevIdx = result.index;
	}

	parts.push(str.substring(prevIdx));
	return parts.filter(Boolean);
}

export function stripWordBankWords(wordBank: WordBank): WordBank {
	const newBank = structuredClone(wordBank);
	for (const key of Object.keys(newBank.words)) {
		newBank.words[key] = [];
	}
	return newBank;
}

export function dedupWordBank(existing: WordBank, newWordBank: WordBank) {
	return {
		...existing,
		words: existing.categories.reduce(
			(acc, category) => {
				acc[category] = Array.from(new Set([...existing.words[category], ...newWordBank.words[category]]));
				return acc;
			},
			{} as WordBank['words'],
		),
	};
}
