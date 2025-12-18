import type { Template, WordBank } from '@/types';
import { extractCategories } from '@/utils/extractCategories';
import { dedupWordBank } from '@/utils/helperFunctions';
import {
	addDoc,
	collection,
	getDocs,
	getDoc,
	setDoc,
	doc,
	updateDoc,
	deleteDoc,
	Timestamp,
	DocumentSnapshot,
	type DocumentData,
	DocumentReference,
} from 'firebase/firestore';
import { customAlphabet, nanoid } from 'nanoid';

import { db } from './firebase';

const TEMPLATE_COLLECTION = 'templates';
const WORDBANK_COLLECTION = 'wordbank';
const generateId = customAlphabet('0123456789ABCDFGHJKLMNPQRSTUVWXYZ');

// export async function createTemplate(template: Template): Promise< Template> {
// 	const createdAt = new Date();
// 	const docRef = await timeout(addDoc(collection(db, TEMPLATE_COLLECTION), { ...template, createdAt }));
// 	return {
// 		...template,
// 		id: docRef.id,
// 		createdAt: createdAt.getTime(),
// 	};
// }

// export async function fetchSavedTemplates() {
// 	const result = await timeout(getDocs(collection(db, TEMPLATE_COLLECTION)));
// 	return result.docs.map(docObjectToTemplate);
// }

// export async function fetchTemplate(templateId: string) {
// 	const result = await timeout(getDoc(doc(db, TEMPLATE_COLLECTION, templateId)));
// 	return docObjectToTemplate(result);
// }

// export function updateTemplate(templateId: string, template: Partial<Template>) {
// 	return timeout(updateDoc(doc(db, TEMPLATE_COLLECTION, templateId), template));
// }

// export function deleteTemplate(templateId: string) {
// 	return timeout(deleteDoc(doc(db, TEMPLATE_COLLECTION, templateId)));
// }

// function docObjectToTemplate(docObj: DocumentSnapshot<DocumentData, DocumentData>): SavedTemplate | undefined {
// 	const template = docObj.data();
// 	return template
// 		? {
// 				id: docObj.id,
// 				title: template.title,
// 				text: template.text,
// 				createdAt: (template.createdAt as Timestamp).toDate().getTime(),
// 			}
// 		: undefined;
// }

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
