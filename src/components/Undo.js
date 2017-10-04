import React, { Component } from 'react';

import { connect } from 'react-redux';
import { undoHistory } from '../actions/index';

class Undo extends Component {
	constructor(props) {
		super(props);
		console.log( this.props );
	}
}

export default connect(
  state => ({ history: state.history })
)(Undo);