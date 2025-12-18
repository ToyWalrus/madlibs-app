import { useNavigate } from 'react-router';

import { Tab, TabList, TabPanel, Tabs } from '@react-spectrum/s2';

import { Templates } from './Templates';
import { WordBank } from './WordBank';

export function Home() {
	return (
		<div>
			<Tabs aria-label="a">
				<TabList>
					<Tab aria-label="a" id="templates">
						Templates
					</Tab>
					<Tab aria-label="a" id="words">
						Word bank
					</Tab>
				</TabList>
				<TabPanel aria-label="a" id="templates">
					<Templates />
				</TabPanel>
				<TabPanel aria-label="a" id="words">
					<WordBank />
				</TabPanel>
			</Tabs>
		</div>
	);
}

export function Home2() {
	const navigate = useNavigate();

	const navigateTo = (path: string) => () => navigate(path);

	return (
		<div className="container">
			<div className="header">
				<h1>🎭 Mad Libs</h1>
				<p>Create silly stories together!</p>
			</div>

			<div>
				<div className="card">
					<button className="btn btn-primary" onClick={navigateTo('/new')}>
						✨ Create New Template
					</button>
					<button className="btn btn-secondary" onClick={navigateTo('/templates')}>
						📝 My Templates
					</button>
					<button className="btn btn-secondary" onClick={navigateTo('/words')}>
						📚 Manage Word Banks
					</button>
					<button className="btn btn-secondary" onClick={navigateTo('/share')}>
						🔗 Load Shared Mad Lib
					</button>
				</div>
			</div>

			{/*

			<div id="fillScreen" className="screen">
				<div className="card">
					<a href="#" className="back-link" onClick="cancelGenerate(); return false;">
						← Back
					</a>
					<h2 style="margin-bottom: 20px" id="fillTitle"></h2>
					<div id="fillForm"></div>
					<button className="btn btn-success" onClick="generateMadLib()">
						🎲 Generate Mad Lib!
					</button>
				</div>
			</div>

			<div id="resultScreen" className="screen">
				<div className="card">
					<a href="#" className="back-link" onClick="showScreen('templatesScreen'); return false;">
						← Back to Templates
					</a>
					<h2 style="margin-bottom: 20px">Your Mad Lib!</h2>
					<div className="result-box" id="resultText"></div>
					<button className="btn btn-primary" onClick="generateAgain()">
						🎲 Generate Again
					</button>
					<button className="btn btn-secondary" onClick="showScreen('templatesScreen')">
						Done
					</button>
				</div>
			</div>

			<div id="loadScreen" className="screen">
				<div className="card">
					<a href="#" className="back-link" onClick="showScreen('homeScreen'); return false;">
						← Back
					</a>
					<h2 style="margin-bottom: 20px">Load Shared Mad Lib</h2>

					<div id="loadAlert"></div>

					<div className="input-group">
						<label>Enter Share Code</label>
						<input type="text" id="shareCodeInput" placeholder="ABC123" style="text-transform: uppercase" />
						<div className="help-text">Enter the 6-character code someone shared with you</div>
					</div>

					<button className="btn btn-primary" onClick="loadShared()">
						Load Mad Lib
					</button>
				</div>
			</div>

			<div id="shareScreen" className="screen">
				<div className="card">
					<a href="#" className="back-link" onClick="showScreen('templatesScreen'); return false;">
						← Back
					</a>
					<h2 style="margin-bottom: 20px">Share Your Mad Lib</h2>

					<p style="margin-bottom: 16px; color: #6b7280">
						Share this code with others so they can use your mad lib template!
					</p>

					<div className="share-code-display">
						<div className="code" id="shareCodeDisplay"></div>
					</div>

					<button className="btn btn-primary" onClick="copyShareCode()">
						📋 Copy Code
					</button>
					<button className="btn btn-secondary" onClick="showScreen('templatesScreen')">
						Done
					</button>
				</div>
			</div> */}
		</div>
	);
}
