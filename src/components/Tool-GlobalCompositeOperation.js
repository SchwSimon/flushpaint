import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
	setGlobalCompositeOperation,
	GlobalCompositeOperations
} from '../actions/index';

import '../styles/Tool-GlobalCompositeOperation.css';

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