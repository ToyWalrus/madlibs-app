import type { WordBank } from '@/types';
import { customAlphabet } from 'nanoid';

import { categoryRegex } from './constants';

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
 * Returns a randomly generated 5-character string of alpha-numeric characters.
 */
const generateId = customAlphabet('0123456789ABCDFGHJKLMNPQRSTUVWXYZ');
export function generateShareId() {
	return generateId(5);
}

/**
 * Selects a random item from the array and returns it. If there are no
 * valid selections in the array after the ignore array has been used as a filter,
 * the full array will be used again.
 */
export function pickRandom<T>(arr: T[], ignore?: T[], comparator?: (a: T, b: T) => boolean) {
	if (!arr.length) {
		throw new Error('Array cannot be empty');
	}

	const filterFn = (item: T) => {
		if (comparator) {
			return !ignore?.some(toIgnore => comparator(item, toIgnore));
		}
		return !ignore?.includes(item);
	};

	let filteredArr = ignore ? arr.filter(filterFn) : arr;
	if (!filteredArr.length) {
		console.error('No items to pick from remaining array; using full array instead');
		filteredArr = arr;
	}

	const randomIndex = Math.floor(Math.random() * filteredArr.length);
	return filteredArr[randomIndex];
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

/**
 * Keeps the WordBank.categories and each of the arrays in WordBank.words, but empties the arrays.
 * @returns A new object with empty arrays in WordBank.words.
 */
export function stripWordBankWords(wordBank: WordBank): WordBank {
	const newBank = structuredClone(wordBank);
	for (const key of Object.keys(newBank.words)) {
		newBank.words[key] = [];
	}
	return newBank;
}

/**
 * Merges the second word bank into the first, and ensures there are no duplicates in WordBank.words.
 * @returns A new object with unique strings for each of the WordBank.words arrays.
 */
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

/**
 * Computes the difference between two sets, returning a new set containing elements
 * that are in the first set but not in the second set. An optional comparator function
 * can be provided to customize the comparison logic.
 * @returns A new set containing elements from the first set that are not in the second set.
 *
 * @example
 * ```typescript
 * const setA = new Set([1, 2, 3]);
 * const setB = new Set([2, 3, 4]);
 *
 * // Without comparator
 * const result1 = exceptSets(setA, setB);
 * console.log(result1); // Output: Set { 1 }
 *
 * // With comparator
 * const setC = new Set([{ id: 1 }, { id: 2 }]);
 * const setD = new Set([{ id: 2 }]);
 * const result2 = exceptSets(setC, setD, (a, b) => a.id === b.id);
 * console.log(result2); // Output: Set { { id: 1 } }
 * ```
 */
export function exceptSets<T>(a: Set<T>, b: Set<T>, comparator?: (a: T, B: T) => boolean) {
	const result = new Set<T>();

	if (comparator) {
		for (const itemA of a) {
			let found = false;
			for (const itemB of b) {
				if (comparator(itemA, itemB)) {
					found = true;
					break;
				}
			}
			if (!found) {
				result.add(itemA);
			}
		}
	} else {
		for (const item of a) {
			if (!b.has(item)) {
				result.add(item);
			}
		}
	}

	return result;
}

/**
 * Computes the intersection of two sets, returning a new set containing elements
 * that are present in both sets. An optional comparator function can be provided
 * to customize the comparison logic.
 * @returns A new set containing elements that are present in both sets.
 *
 * @example
 * ```typescript
 * const setA = new Set([1, 2, 3]);
 * const setB = new Set([2, 3, 4]);
 *
 * // Without comparator
 * const result1 = intersectSets(setA, setB);
 * console.log(result1); // Output: Set { 2, 3 }
 *
 * // With comparator
 * const setC = new Set([{ id: 1 }, { id: 2 }]);
 * const setD = new Set([{ id: 2 }]);
 * const result2 = intersectSets(setC, setD, (a, b) => a.id === b.id);
 * console.log(result2); // Output: Set { { id: 2 } }
 * ```
 */
export function intersectSets<T>(a: Set<T>, b: Set<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
	const result = new Set<T>();

	if (comparator) {
		for (const itemA of a) {
			for (const itemB of b) {
				if (comparator(itemA, itemB)) {
					result.add(itemA);
					break;
				}
			}
		}
	} else {
		for (const item of a) {
			if (b.has(item)) {
				result.add(item);
			}
		}
	}

	return result;
}
