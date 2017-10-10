import React, { Component } from 'react';
import { connect } from 'react-redux';

import { undoHistory } from '../actions/index';

import '../styles/Tool-History.css';

class History extends Component {
	constructor(props) {
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}
	
	// on undo click
	onClick(event) {
			// undo the last layer action
		this.props.dispatch(undoHistory())
	}
	
	render() {
		return (
			<div className="History button" onClick={this.onClick}>Undo</div>
		);
	}
}

export default connect()(History);