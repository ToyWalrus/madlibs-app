import { fetchWordbank } from '@/database';
import type { WordBank } from '@/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface WordActionPayload {
	shareId?: string;
	category: string;
	word: string;
}

const initialState: Record<string, WordBank> = {};

const wordsSlice = createSlice({
	name: 'words',
	initialState,
	reducers: {
		// reset: () => {
		// 	return {};
		// },
		// addWord: (state, action: PayloadAction<WordActionPayload>) => {
		// 	const { category, word } = action.payload;
		// 	state[category] ??= new Set();
		// 	state[category].add(word);
		// },
		// removeWord: (state, action: PayloadAction<WordActionPayload>) => {
		// 	state[action.payload.category]?.delete(action.payload.word);
		// },
	},
	extraReducers: builder => {
		builder.addAsyncThunk(loadWordbank, {
			fulfilled: (state, action) => {
				const { shareId, wordbank } = action.payload;
				state[shareId] = wordbank;
			},
		});
	},
	selectors: {
		selectWordBank: state => state,
		selectWordsInCategory: (state, category: string) => state[category] ?? new Set(),
		getCategories: state => Object.keys(state),
	},
});

export const loadWordbank = createAsyncThunk('words/loadWordbank', async (shareId: string) => {
	const wordbank = await fetchWordbank(shareId);
	return { shareId, wordbank };
});

export const { selectWordBank, selectWordsInCategory, getCategories } = wordsSlice.selectors;
// export const { addWord, removeWord, reset } = wordsSlice.actions;
export default wordsSlice;
