import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setGlobalCompositeOperation } from '../actions/index';

import '../styles/Tool-GlobalCompositeOperation.css';

export const GlobalCompositeOperations = {
	SOURCE_OVER: 'source-over',
	SOURCE_IN: 'source-in',
	SOURCE_OUT: 'source-out',
	SOURCE_ATOP: 'source-atop',
	DESTINATION_OVER: 'destination-over',
	DESTINATION_IN: 'destination-in',
	DESTINATION_OUT: 'destination-out',
	DESTINATION_ATOP: 'destination-atop',
	LIGHTER: 'lighter',
	COPY: 'copy',
	XOR: 'xor',
	MULTIPLY: 'multiply',
	SCREEN: 'screen',
	OVERLAY: 'overlay',
	DARKEN: 'darken',
	LIGHTEN: 'lighten',
	COLOR_DODGE: 'color-dodge',
	COLOR_BURN: 'color-burn',
	HARD_LIGHT: 'hard-light',
	SOFT_LIGHT: 'soft-light',
	DIFFERENCE: 'difference',
	EXCLUSION: 'exclusion',
	HUE: 'hue',
	SATURATION: 'saturation',
	COLOR: 'color',
	LUMINOSITY: 'luminosity'
};

class GlobalCompositeOperation extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	// on select change
	onChange(event) {
			// set the selected option as globalCompositeOperation
		this.props.dispatch(setGlobalCompositeOperation(event.target.value));
	}

	render() {
		return (
			<select
				className="GlobalCompositeOperation"
				onChange={this.onChange}
				defaultValue={this.props.gcOperation}
			>
				{Object.keys(GlobalCompositeOperations).map((key, index) => {
					return <option key={index}>{GlobalCompositeOperations[key]}</option>;
				})}
			</select>
		);
	}
}

export default connect(
	state => ({
		gcOperation: state.settings.globalCompositeOperation	// the selected global composite operation value
	})
)(GlobalCompositeOperation);
