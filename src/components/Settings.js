import React, { Component } from 'react';

import SettingsApp from './SettingsApp';

import Undo from  './Undo';

const triggerComponents = {
	undo: Undo
}

class Settings extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			app: '',
		}
		
		this.openApp = this.openApp.bind(this);
		this.closeApp = this.closeApp.bind(this);
		this.triggerComponent = this.triggerComponent.bind(this);
	}

	openApp(event) {
		this.setState({
			app: event.target.getAttribute('app')
		});
	}
	
	closeApp() {
		this.setState({
			app: ''
		});
	}
	
	triggerComponent(event) {
		console.log( triggerComponents[event.target.getAttribute('name')] );
	}
	
	render() {
		return (
			<div className="App-settings">
				<div className="App-settings-nav">
					<button onClick={this.openApp} app="strokeStyle">Color</button>
					<button onClick={this.openApp} app="lineWidth">Size</button>
					<button onClick={this.openApp} app="lineCap">Type</button>
					<button onClick={this.openApp} app="globalCompositeOperation">Composite Operation</button>
					<button onClick={this.triggerComponent} name="undo">Undo</button>
				</div>
				<SettingsApp
					name={this.state.app}
					close={this.closeApp}
				/>
			</div>
		);
	}
}

export default Settings;