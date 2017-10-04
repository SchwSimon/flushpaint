import React, { Component } from 'react';

import { connect } from 'react-redux';
import { setLineCap } from '../actions/index';

import './Linecap.css';

class LineCap extends Component {	
	componentDidMount() {
		this.setCurrent(this.props.settings.lineCap);
		this.onClick = this.onClick.bind(this);
	}
	
	setCurrent(lineCap) {
		this.setState((prevState, props) => {
			if (prevState) {
				this.refs[prevState.value].disabled = false;
				let { dispatch } = props;
				dispatch(setLineCap(lineCap));
			}
			this.refs[lineCap].disabled = true;
			return { value: lineCap };
		});
	}
	
	onClick(event) {
		this.setCurrent(event.target.value);
	}
	
	render() {
		return (
			<div className="LineCap">
				<button onClick={this.onClick} value="round" ref="round">Round</button>
				<button onClick={this.onClick} value="square" ref="square">Square</button>
				<button onClick={this.onClick} value="butt" ref="butt">Butt</button>
			</div>
		);
	}
}

export default connect(
  state => ({ settings: state.settings })
)(LineCap);