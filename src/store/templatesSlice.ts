import type { Template } from '@/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TemplateStore {
	templates: Template[];
	loadingAll: boolean;
	saving: boolean;
	errorMessage?: string;
}

// const loadAllTemplates = createAsyncThunk('template/loadAllTemplates', async () => {
// 	const templates = await fetchSavedTemplates();
// 	return { templates };
// });

// let templateCounter = 0;
// const addNewTemplate = createAsyncThunk('template/addNewTemplate', async (template: Template) => {
// 	let savedTemplate: SavedTemplate | undefined;
// 	try {
// 		savedTemplate = await createTemplate(template);
// 	} catch (e) {
// 		console.error('Error saving template', e);
// 		savedTemplate = { ...template, id: (templateCounter++).toString(), createdAt: new Date().getTime() };
// 	}

// 	return savedTemplate;
// });

// const editTemplate = createAsyncThunk(
// 	'template/editTemplate',
// 	async ({ id, template }: { id: string; template: Partial<Template> }) => {
// 		await updateTemplate(id, template);
// 		return { id, template };
// 	},
// );

// const removeTemplate = createAsyncThunk('template/removeTemplate', async (id: string) => {
// 	await deleteTemplate(id);
// 	return id;
// });

const templateSlice = createSlice({
	name: 'template',
	initialState: {
		templates: [],
		loadingAll: false,
		saving: false,
	} as TemplateStore,
	reducers: {
		addNewTemplate: (state, action: PayloadAction<Template>) => {
			state.templates.push(action.payload);
		},
		removeTemplate: (state, action: PayloadAction<string>) => {
			const idx = state.templates.findIndex(t => t.shareId === action.payload);
			if (idx > -1) {
				state.templates.splice(idx, 1);
			}
		},
	},
	// extraReducers: builder => {
	// 	builder.addAsyncThunk(loadAllTemplates, {
	// 		pending: state => {
	// 			state.loadingAll = true;
	// 			state.errorMessage = undefined;
	// 		},
	// 		fulfilled: (state, action) => {
	// 			state.templates = action.payload.templates as SavedTemplate[];
	// 			state.loadingAll = false;
	// 		},
	// 		rejected: (state, action) => {
	// 			state.templates = [];
	// 			state.errorMessage = action.error.message;
	// 			state.loadingAll = false;
	// 		},
	// 	});

	// 	builder.addAsyncThunk(addNewTemplate, {
	// 		pending: state => {
	// 			state.saving = true;
	// 		},
	// 		fulfilled: (state, action) => {
	// 			state.templates.push(action.payload);
	// 			state.saving = false;
	// 		},
	// 		rejected: (state, action) => {
	// 			state.saving = false;
	// 			state.errorMessage = action.error.message;
	// 		},
	// 	});

	// 	builder.addAsyncThunk(editTemplate, {
	// 		pending: state => {
	// 			state.saving = true;
	// 		},
	// 		fulfilled: (state, action) => {
	// 			state.saving = false;
	// 			const idx = state.templates.findIndex(t => t.id === action.payload.id);
	// 			if (idx === -1) return;

	// 			state.templates.splice(idx, 1, {
	// 				...state.templates[idx],
	// 				...action.payload.template,
	// 			});
	// 		},
	// 		rejected: (state, action) => {
	// 			state.saving = false;
	// 			state.errorMessage = action.error.message;
	// 		},
	// 	});

	// 	builder.addAsyncThunk(removeTemplate, {
	// 		pending: state => {
	// 			state.saving = true;
	// 		},
	// 		fulfilled: (state, action) => {
	// 			state.saving = false;
	// 			const idx = state.templates.findIndex(t => t.id === action.payload);
	// 			if (idx !== -1) return;

	// 			state.templates.splice(idx, 1);
	// 		},
	// 		rejected: (state, action) => {
	// 			state.saving = false;
	// 			state.errorMessage = action.error.message;
	// 		},
	// 	});
	// },
	selectors: {
		selectTemplates: state => state.templates,
		selectTemplate: (state, id?: string) => (id ? state.templates.find(t => t.id === id) : undefined),
		selectIsLoading: state => state.loadingAll,
		selectIsSaving: state => state.saving,
		selectErrorMessage: state => state.errorMessage,
	},
});

// export { loadAllTemplates, addNewTemplate, editTemplate, removeTemplate };
export const { selectTemplates, selectTemplate, selectIsLoading, selectIsSaving, selectErrorMessage } =
	templateSlice.selectors;
export const { addNewTemplate, removeTemplate } = templateSlice.actions;
export default templateSlice;
