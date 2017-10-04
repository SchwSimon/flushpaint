import React, { Component } from 'react';

import { connect } from 'react-redux';
import { setLineWidth } from '../actions/index';

import './Linewidth.css';

class LineWidth extends Component {
	componentWillMount() {
		this.setCurrent(this.props.settings.lineWidth);
		this.onChange = this.onChange.bind(this);
	}
	
	setCurrent(lineWidth) {
		this.setState((prevState, props) => {
			let { dispatch } = props;
			dispatch(setLineWidth(lineWidth));
			return { lineWidth: lineWidth*1 }
		});
	}
	
	onChange(event) {
		this.setCurrent(event.target.value);
	}
	
	render() {
		return (
			<div className="Linewidth">
				<input type="range" min="1" max="30" defaultValue={this.state.lineWidth} onChange={this.onChange} />
				<div className="Linewidth-size" style={{
					width: this.state.lineWidth,
					height: this.state.lineWidth,
					borderRadius: this.state.lineWidth/2
				}}></div>
			</div>
		);
	}
}

export default connect(
  state => ({ settings: state.settings })
)(LineWidth);