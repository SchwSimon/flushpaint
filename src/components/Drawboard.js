import React, { Component } from 'react';

import { connect } from 'react-redux';
import { pushHistory } from '../actions/index';

import './Drawboard.css';

class Drawboard extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isDrawing: false
		}
		
		this.enableDrawing = this.enableDrawing.bind(this);
		this.disableDrawing = this.disableDrawing.bind(this);
		this.draw = this.draw.bind(this);
		this.onResize = this.onResize.bind(this);
	}
	
	componentDidMount() {
		this.updateOffset();
		
		window.addEventListener('resize', this.onResize, false);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize, false);
	}
	
	updateOffset() {
		const clientRect = this.refs.drawboard.getBoundingClientRect();
		this.setState({
			offsetLeft: clientRect.left,
			offsetTop: clientRect.top
		});
	}
	
	enableDrawing(event) {
		event.preventDefault();
		event.stopPropagation();
		event.persist();
		
		let { dispatch } = this.props;
		dispatch(pushHistory(
			event.target.getContext('2d').getImageData(
				0, 0,
				event.target.width,
				event.target.height
			)
		));
		
		this.setState({
			isDrawing: true
		}, () => this.draw(event) );
	}
	
	disableDrawing() {
		this.setState({ isDrawing: false });
	}
	
	draw(event) {
		if (this.state.isDrawing) {
			event.preventDefault();
			event.stopPropagation();

			const toX = event.clientX - this.state.offsetLeft;
			const toY = event.clientY - this.state.offsetTop;
			const ctx = event.target.getContext('2d');
			ctx.strokeStyle = this.props.state.settings.strokeStyle;
			ctx.lineCap = this.props.state.settings.lineCap;
			ctx.lineWidth = this.props.state.settings.lineWidth;
			ctx.globalCompositeOperation = this.props.state.settings.globalCompositeOperation;
			ctx.beginPath();
			ctx.moveTo( toX, toY );
			ctx.lineTo( toX, toY + 0.1 );
			ctx.stroke();
		}
	}
	
	onResize() {
		this.updateOffset();
	}
	
	render() {
		return (
			<canvas
				ref="drawboard"
				className="App-drawboard"
				width="800px"
				height="400px"
				onMouseDown={this.enableDrawing}
				onMouseMove={this.draw}
				onMouseUp={this.disableDrawing}
				onMouseOut={this.disableDrawing}
			></canvas>
		);
	}
}

export default connect(
	state => ({ state: state })
)(Drawboard);