import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AppTab = 'templates' | 'words';
export interface AppSlice {
	tab: AppTab;
}

const appSlice = createSlice({
	name: 'app',
	initialState: { tab: 'templates' } as AppSlice,
	reducers: {
		setCurrentTab: (state, action: PayloadAction<AppTab>) => {
			state.tab = action.payload;
		},
	},
	selectors: {
		selectCurrentTab: state => state.tab,
	},
});

export const { setCurrentTab } = appSlice.actions;
export const { selectCurrentTab } = appSlice.selectors;
export default appSlice;
