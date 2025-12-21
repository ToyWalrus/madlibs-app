import type { Template, WordBank } from '@/types';
import { dedupWordBank, extractCategories } from '@/utils/helperFunctions';
import { getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

import { db } from './firebase';

const TEMPLATES_KEY = 'templates';
const WORDBANK_COLLECTION = 'wordbank';

async function timeout<T>(promise: Promise<T>, timeoutVal = 30000): Promise<T> {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) => {
			setTimeout(() => reject(`Call timed out after ${(timeoutVal / 1000).toFixed(1)} seconds`), timeoutVal);
		}),
	]);
}

export async function shareIdExists(shareId: string) {
	const docRef = doc(db, WORDBANK_COLLECTION, shareId);
	const snapshot = await timeout(getDoc(docRef));
	return snapshot.exists();
}

export async function ensureWordbankExists(template: Template) {
	if (!(await shareIdExists(template.shareId))) {
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

export function saveTemplate(template: Template) {
	const templateList = getAllSavedTemplates();
	const existing = templateList.find(t => t.shareId === template.shareId);
	if (existing) {
		existing.text = template.text;
		existing.title = template.title;
	} else {
		templateList.push(template);
	}
	localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templateList));
}

export function deleteSavedTemplate(shareId: string) {
	let templateList = getAllSavedTemplates();
	templateList = templateList.filter(template => template.shareId !== shareId);
	localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templateList));
}

export function getAllSavedTemplates(): Template[] {
	const val = localStorage.getItem(TEMPLATES_KEY);
	return val ? JSON.parse(val) : [];
}

export function getSavedTemplate(shareId?: string) {
	const templateList = getAllSavedTemplates();
	return templateList.find(t => t.shareId === shareId);
}
