import React, { Component } from 'react';
import './Linecap.css';

class LineCap extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			lineCap: 'round',
			callback: () => {}
		}
		
		this.setLineCap = this.setLineCap.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	
	componentDidMount() {
		if (this.props.lineCap) {
			this.setLineCap(this.props.lineCap);
		}
		if (this.props.onChange) {
			this.setCallback(this.props.onChange);
		}
	}
	
	setCallback(callback) {
		this.setState({
			callback: callback
		})
	}
	
	setLineCap(lineCap) {
		this.refs[this.state.lineCap ].disabled = false;
		this.refs[lineCap].disabled = true;

		this.setState({
			lineCap: lineCap
		});
	}
	
	onClick(event) {
		this.setLineCap(event.target.value);
		this.state.callback(event.target.value);
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

export default LineCap;