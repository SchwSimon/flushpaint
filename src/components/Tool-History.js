import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { undoHistory } from '../actions/index';

import '../styles/Tool-History.css';

export class History extends PureComponent {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.dispatch(undoHistory())
	}

	render() {
		return (
			<div className="History button" onClick={this.onClick}>Undo</div>
		);
	}
}

export default connect()(History);
