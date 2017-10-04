import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
	setLineCap,
	LineCaps
} from '../actions/index';

import './Linecap.css';

class LineCap extends Component {
	constructor(props) {
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(event) {
		let { dispatch } = this.props;
		dispatch(setLineCap(event.target.value));
	}
	
	render() {
		const buttons = Object.keys(LineCaps).map((key, index) => {
			return (
				<button
					key={index}
					onClick={this.onClick}
					value={LineCaps[key]}
					ref={button => this[LineCaps[key]] = button}
					disabled={(this.props.lineCap === LineCaps[key]) ? 'true' : ''}
				>{LineCaps[key].charAt(0).toUpperCase() + LineCaps[key].substr(1)}
				</button>
			);
		});
	
		return (
			<div className="LineCap">
				{buttons}
			</div>
		);
	}
}

export default connect(
  state => ({ lineCap: state.settings.lineCap })
)(LineCap);