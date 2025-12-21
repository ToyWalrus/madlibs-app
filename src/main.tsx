import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

import { Provider as S2Provider, UNSTABLE_ToastContainer } from '@react-spectrum/s2';
import '@react-spectrum/s2/page.css';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { getSavedTemplate } from '@/database';
import { GenerationPage } from '@/screens/GenerationPage';
import { TemplateCreation } from '@/screens/TemplateCreation';
import { TemplateList } from '@/screens/TemplateList';
import { WordBank } from '@/screens/WordBank';
import store from '@/store';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ReduxProvider>
	</StrictMode>,
);

function App() {
	return (
		<S2Provider background="layer-1" styles={style({ height: 'full', overflow: 'hidden' })}>
			<Routes>
				<Route path="/" element={<TemplateList />} />
				<Route path="/create" element={<TemplateCreation />} />
				<Route path="/create/:shareId" element={<EditPageWrapper />} />
				<Route path="/wordbank/:shareId" element={<WordBankWrapper />} />
				<Route path="/generate/:shareId" element={<GenerationPageWrapper />} />
			</Routes>
			<UNSTABLE_ToastContainer placement="bottom" />
		</S2Provider>
	);
}

function GenerationPageWrapper() {
	const params = useParams();
	return <GenerationPage template={getSavedTemplate(params.shareId)} />;
}

function EditPageWrapper() {
	const params = useParams();
	return <TemplateCreation existingTemplate={getSavedTemplate(params.shareId)} />;
}

function WordBankWrapper() {
	const params = useParams();
	return <WordBank shareId={params.shareId} />;
}
