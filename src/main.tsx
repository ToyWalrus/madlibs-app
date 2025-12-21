import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { Provider as S2Provider, UNSTABLE_ToastContainer, Tab, TabList, TabPanel, Tabs } from '@react-spectrum/s2';
import '@react-spectrum/s2/page.css';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { Templates } from '@/screens/Templates.tsx';
import { WordBank } from '@/screens/WordBank.tsx';
import store, { useDispatch, useSelector } from '@/store';
import { selectCurrentTab, setCurrentTab, type AppTab } from '@/store/appSlice.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<App />
		</ReduxProvider>
	</StrictMode>,
);

function App() {
	const currentTab = useSelector(selectCurrentTab);
	const dispatch = useDispatch();

	return (
		<S2Provider background="layer-1" styles={style({ height: 'full', overflow: 'hidden' })}>
			<Templates />
			{/* <WordBank shareId={'0'} /> */}
			<UNSTABLE_ToastContainer placement="bottom" />
			{/* <Tabs
				aria-label="Tabs"
				onSelectionChange={key => dispatch(setCurrentTab(key as AppTab))}
				selectedKey={currentTab}
			>
				<TabList>
					<Tab id="templates">Templates</Tab>
					<Tab id="words">Shared</Tab>
				</TabList>
				<TabPanel id="templates">
					<Templates />
				</TabPanel>
				<TabPanel id="words">
					<WordBank />
				</TabPanel>
			</Tabs> */}
		</S2Provider>
	);
}
