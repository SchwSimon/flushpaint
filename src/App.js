import React, { Component } from 'react';

import Drawboard from './components/Drawboard';
import Settings from './components/Settings';

import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">FlushPaint</h1>
				</header>
				<Settings />
				<Drawboard />
			</div>
		);
	}
}

export default App;