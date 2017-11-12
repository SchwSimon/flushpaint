import React, { PureComponent } from 'react';

import Header from './Header';
import Drawboard from './Drawboard';
import Settings from './Settings';

export class App extends PureComponent {
	render() {
		return (
			<div className="App">
				<Header />
				<Settings />
				<Drawboard />
			</div>
		);
	}
}

export default App;
