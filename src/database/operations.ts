import type { Template, WordBank } from '@/types';
import { dedupWordBank, extractCategories } from '@/utils/helperFunctions';
import { getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';

import { db } from './firebase';

const WORDBANK_COLLECTION = 'wordbank';
const generateId = customAlphabet('0123456789ABCDFGHJKLMNPQRSTUVWXYZ');

async function timeout<T>(promise: Promise<T>, timeoutVal = 30000): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) => {
			setTimeout(() => reject(`Call timed out after ${(timeoutVal / 1000).toFixed(1)} seconds`), timeoutVal);
		}),
	]);
}

export async function ensureWordbankExists(template: Template) {
	const docRef = doc(db, WORDBANK_COLLECTION, template.shareId);
	const snapshot = await timeout(getDoc(docRef));
	if (!snapshot.exists()) {
		await shareCategories(template);
	}
}

export async function shareCategories(template: Template) {
	const categories = extractCategories(template.text);
	const categoryWords = categories.reduce((acc, cur) => ({ [cur]: [], ...acc }), {});
	await timeout(setDoc(doc(db, WORDBANK_COLLECTION, template.shareId), { categories, words: categoryWords }));
}

export async function getCategoriesFromShareId(id: string): Promise<string[]> {
	if (!id) return [];

	const wordbank = await fetchWordbank(id);
	return wordbank.categories;
}

export async function updateWordbank(shareId: string, wordbank: WordBank) {
	const existing = await fetchWordbank(shareId);
	const updatedBank = dedupWordBank(existing, wordbank);

	await timeout(setDoc(doc(db, WORDBANK_COLLECTION, shareId), updatedBank));
}

export async function fetchWordbank(shareId: string): Promise<WordBank> {
	const docRef = doc(db, WORDBANK_COLLECTION, shareId);
	const result = await timeout(getDoc(docRef));
	if (!result.exists()) {
		throw new Error(`No wordbank found for share ID: ${shareId}`);
	}

	return result.data() as WordBank;
}

export async function deleteWordbank(shareId: string) {
	return timeout(deleteDoc(doc(db, WORDBANK_COLLECTION, shareId)));
}
