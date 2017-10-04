import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
	setGlobalCompositeOperation,
	GlobalCompositeOperations
} from '../actions/index';

class GlobalCompositeOperation extends Component {
	componentWillMount() {
		this.onChange = this.onChange.bind(this);
		this.setCurrent(this.props.settings.globalCompositeOperation);
	}
	
	setCurrent(operation) {
		this.setState((prevState, props) => {
			if (prevState) {
				let { dispatch } = props;
				dispatch(setGlobalCompositeOperation(operation));
			}
			return { operation: operation };
		});
	}
	
	onChange(event) {
		this.setCurrent(event.target.value);
	}
	
	render() {
		const options = Object.keys(GlobalCompositeOperations).map((key, index) => {
			return <option key={index}>{GlobalCompositeOperations[key]}</option>
		});
		
		return (
			<select onChange={this.onChange} defaultValue={this.state.operation}>
				{options}
			</select>
		);
	}
}

export default connect(
	state => ({ settings: state.settings })
)(GlobalCompositeOperation);