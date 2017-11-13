import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLineWidth } from '../actions/index';
import { LineCaps } from './Tool-LineCap';

import '../styles/Tool-LineWidth.css';

class LineWidth extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	// on range input change
	onChange(event) {
			// set the new stroke width
		this.props.dispatch(setLineWidth(event.target.value));
	}

	render() {
		return (
			<div className="LineWidth">
				<input
					className="LineWidth-input"
					type="range"
					min="1"
					max="40"
					defaultValue={this.props.lineWidth}
					onChange={this.onChange}
				/>
				<div className="LineWidth-strokeDisplay">
					<div className="LineWidth-stroke" style={{
						width: this.props.lineWidth,
						height: (this.props.lineCap === LineCaps.BUTT) ? 1 : this.props.lineWidth,
						borderRadius: (this.props.lineCap === LineCaps.ROUND) ? this.props.lineWidth/2 : 0,
						backgroundColor: this.props.strokeStyle
					}}></div>
					<div className="LineWidth-strokeCenter"></div>
					<div className="LineWidth-strokeInfo">{this.props.lineWidth} px</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		lineWidth: state.settings.lineWidth,			// the selected stroke width
		lineCap: state.settings.lineCap,				// the selected stroke cap
		strokeStyle: state.settings.strokeStyle	// the selected color
	})
)(LineWidth);
