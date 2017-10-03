import React, { Component } from 'react';
import './Linewidth.css';

class LineWidth extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			lineWidth: 15,
			callback: () => {}
		}
		
		this.onChange = this.onChange.bind(this);
	}
	
	componentWillMount() {
		if (this.props.lineWidth) {
			this.setLineWidth(this.props.lineWidth);
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
	
	setLineWidth(lineWidth) {
		this.setState({
			lineWidth: lineWidth*1
		});
	}
	
	onChange(event) {
		this.setLineWidth(event.target.value);
		this.state.callback(event.target.value);
	}
	
	render() {
		return (
			<div className="Linewidth">
				<input type="range" min="1" max="30" defaultValue={this.props.lineWidth} onChange={this.onChange} />
				<div className="Linewidth-size" style={{
					width: this.state.lineWidth,
					height: this.state.lineWidth,
					borderRadius: this.state.lineWidth/2
				}}></div>
			</div>
		);
	}
}

export default LineWidth;