import React, { Component } from 'react';

import { connect } from 'react-redux';
import { setStrokeStyle } from '../actions/index';

import { SketchPicker } from 'react-color';

class StrokeStyle extends Component {
	componentWillMount() {
		this.setCurrent = this.setCurrent.bind(this);
		this.setCurrent(this.props.settings.strokeStyle);
	}
	
	setCurrent(color) {
		this.setState((prevState, props) => {
			if (prevState) {
				let { dispatch } = props;
				dispatch(setStrokeStyle('rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'));
				color = color.rgb;
			}
			return { color: color };
		});
	}
	
	render() {
		return <SketchPicker color={this.state.color} onChangeComplete={this.setCurrent} />
	}
}

export default connect(
  state => ({ settings: state.settings })
)(StrokeStyle);