import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
	setTool,
	ToolList
} from '../actions/index';

import '../styles/Tool.css';

/**
 * Canvas interaction / manipulation tools
 */
class Tool extends PureComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			name: ((tool) => {
				switch(tool) {
					case ToolList.BRUSH: return 'Paint';				// paint color
					case ToolList.ERASER: return 'Erase';			// erase (becomes transparent)
					case ToolList.MOVE: return 'Select / Move';		// move & select
					case ToolList.PIPETTE: return 'Color pipette';	// get the absorbed color
					case ToolList.TEXT: return 'Text';						// add text
					case ToolList.CROP: return 'Crop';					// crop the canvas
					default: return this.props.tool;
				}
			})(this.props.tool)
		}
		
		this.onClick = this.onClick.bind(this);
	}
	
	onClick() {
		// select the tool
		this.props.dispatch(setTool(this.props.tool));
	}
	
	render() {
		return (
			<div
				className={'Tool Tool-' + this.props.tool + ' button' + ((this.props.tool === this.props.selectedTool) ? ' Tool-active' : '')}
				onClick={this.onClick}
			>{this.state.name}</div>
		);
	}
}

export default connect(
	state => ({
		selectedTool: state.settings.tool	// currently selected tool
	})
)(Tool);

