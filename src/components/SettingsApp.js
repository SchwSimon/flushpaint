import React, { Component } from 'react';

import { connect } from 'react-redux';

import './SettingsApp.css';
import StrokeStyle from './Strokestyle';
import LineWidth from  './Linewidth';
import LineCap from  './Linecap';
import GlobalCompositeOperation from  './Globalcompositeoperation';

const components = {
	strokeStyle: StrokeStyle,
	lineWidth: LineWidth,
	lineCap: LineCap,
	globalCompositeOperation: GlobalCompositeOperation
};

class SettingsApp extends Component {
	componentWillMount() {
		this.onSave = this.onSave.bind(this);
	}
	
	onSave() {	
		this.props.close();
	}
	
	render() {
		if ( !this.props.name ) {
			return null;
		}
		
		const SettingComponent = components[this.props.name];
		
		return (
			<div className="App-settings-appHolder">
				<div className="App-settings-appHead">
					<button className="App-settings-app-close" onClick={this.props.close}>Close</button>
					<button className="App-settings-app-save" onClick={this.onSave}>Save</button>
				</div>
				<div className="App-settings-appMain">
					<SettingComponent className="App-settings-app" />
				</div>
			</div>
		);
	}
}

export default connect(
  state => ({ settings: state.settings })
)(SettingsApp);