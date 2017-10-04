import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
	setLineWidth,
	LineCaps
} from '../actions/index';

import './Linewidth.css';

class LineWidth extends Component {
	constructor(props) {
		super(props);
		
		this.onChange = this.onChange.bind(this);
	}
	
	onChange(event) {
		let { dispatch } = this.props;
		dispatch(setLineWidth(event.target.value));
	}
	
	render() {
		const height = (this.props.lineCap === LineCaps.BUTT) ? 1 : this.props.lineWidth;
		const radius = (this.props.lineCap === LineCaps.ROUND) ? this.props.lineWidth/2 : 0;
		
		return (
			<div className="Linewidth">
				<input type="range" min="1" max="30" defaultValue={this.props.lineWidth} onChange={this.onChange} />
				<div className="Linewidth-size" style={{
					width: this.props.lineWidth,
					height: height,
					borderRadius: radius
				}}></div>
			</div>
		);
	}
}

export default connect(
	state => ({
		lineWidth: state.settings.lineWidth,
		lineCap: state.settings.lineCap
	})
)(LineWidth);