import React, { Component } from 'react';

import { connect } from 'react-redux';
import { undoHistory } from '../actions/index';

import SettingsApp from './SettingsApp';

const dispatchFunctions = {
	undo: undoHistory
}

class Settings extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			app: '',
			trigger: ''
		}
		
		this.openApp = this.openApp.bind(this);
		this.closeApp = this.closeApp.bind(this);
		this.triggerFunction = this.triggerFunction.bind(this);
	}
	
	triggerFunction(event) {
		let { dispatch } = this.props;
		dispatch( dispatchFunctions[event.target.getAttribute('name')]() );
	}
	
	triggerApp(event) {
		this.setState({
			trigger: event.target.getAttribute('app')
		}, () => {
			this.setState({trigger:''});
		});
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
	
	render() {
		return (
			<div className="App-settings">
				<div className="App-settings-nav">
					<button onClick={this.openApp} app="strokeStyle">Color</button>
					<button onClick={this.openApp} app="lineWidth">Size</button>
					<button onClick={this.openApp} app="lineCap">Type</button>
					<button onClick={this.openApp} app="globalCompositeOperation">Composite Operation</button>
					<button onClick={this.triggerFunction} name="undo">Undo</button>
				</div>
				<SettingsApp
					name={this.state.app}
					close={this.closeApp}
				/>
			</div>
		);
	}
}

export default connect()(Settings);