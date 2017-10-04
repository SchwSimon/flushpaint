import React, { Component } from 'react';

import { connect } from 'react-redux';
import { setStrokeStyle } from '../actions/index';

import { SketchPicker } from 'react-color';

class StrokeStyle extends Component {
	constructor(props) {
		super(props);
		
		this.onPick = this.onPick.bind(this);
	}
	
	onPick(color) {
		let { dispatch } = this.props;
		dispatch(setStrokeStyle('rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'));
	}
	
	render() {
		return <SketchPicker color={this.props.color} onChangeComplete={this.onPick} />
	}
}

export default connect(
  state => ({ color: state.settings.strokeStyle })
)(StrokeStyle);