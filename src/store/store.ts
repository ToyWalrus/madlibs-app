import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

import { testTemplates } from '@/utils/testTemplates';
import { configureStore } from '@reduxjs/toolkit';

import appSlice from './appSlice';
import templatesSlice from './templatesSlice';
import wordsSlice from './wordsSlice';

const store = configureStore({
	reducer: {
		[appSlice.name]: appSlice.reducer,
		[templatesSlice.name]: templatesSlice.reducer,
		[wordsSlice.name]: wordsSlice.reducer,
	},
	preloadedState: {
		[templatesSlice.name]: {
			loadingAll: false,
			saving: false,
			templates: testTemplates,
		},
	},
});

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();
