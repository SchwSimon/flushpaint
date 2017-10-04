import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
	setGlobalCompositeOperation,
	GlobalCompositeOperations
} from '../actions/index';

class GlobalCompositeOperation extends Component {
	constructor(props) {
		super(props);
		
		this.onChange = this.onChange.bind(this);
	}
	
	onChange(event) {
		let { dispatch } = this.props;
		dispatch(setGlobalCompositeOperation(event.target.value));
	}
	
	render() {
		const options = Object.keys(GlobalCompositeOperations).map((key, index) => {
			return <option key={index}>{GlobalCompositeOperations[key]}</option>;
		});
		
		return (
			<select onChange={this.onChange} defaultValue={this.props.gcOperation}>
				{options}
			</select>
		);
	}
}

export default connect(
	state => ({ gcOperation: state.settings.globalCompositeOperation })
)(GlobalCompositeOperation);