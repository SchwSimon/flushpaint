import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setTool } from '../actions/index';

import '../styles/Tool.css';

export const ToolList = {
	BRUSH: 'BRUSH',
	ERASER: 'ERASER',
	PIPETTE: 'PIPETTE',
	CROP: 'CROP',
	MOVE: 'MOVE',
	TEXT: 'TEXT'
};

export const ToolNames = {
	BRUSH: 'Paint',
	ERASER: 'Erase',
	PIPETTE: 'Color pipette',
	CROP: 'Crop',
	MOVE: 'Select / Move',
	TEXT: 'Text'
}

/**
 * Canvas interaction / manipulation tools
 */
export class Tool extends PureComponent {
	constructor(props) {
		super(props);

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
			>{ToolNames[this.props.tool]}</div>
		);
	}
}

export default connect(
	state => ({
		selectedTool: state.settings.tool	// currently selected tool
	})
)(Tool);
