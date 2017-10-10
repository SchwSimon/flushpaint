import React, { Component } from 'react';

import { connect } from 'react-redux';

import {
	pushHistory,
	resizeLayer,
	putLayerImageData
} from '../actions/index';

import '../styles/Tool-Crop.css';

class Crop extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			top: (props.layerHeight/2) - 40,
			left: (props.layerWidth/2) - 40,
			width: 80,
			height: 80
		};
		
		this.enableMoving = this.enableMoving.bind(this);
		this.enableResize = this.enableResize.bind(this);
		
		this.disableInteraction = this.disableInteraction.bind(this);
		
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onCrop = this.onCrop.bind(this);
	}
	
	onMouseMove(event) {
		if (this.state.isMoving)
			return this.move(event.clientX, event.clientY);
		if (this.state.isResizing)
			return this.resize(event.clientX, event.clientY);
	}
	
	enableMoving(event) {
		this.setState({
			isMoving: true,
			isResizing: false,
			clientX: event.clientX,
			clientY: event.clientY
		})
	}
	
	move(clientX, clientY) {
		this.setState({
			left: this.state.left - (this.state.clientX - clientX),
			top: this.state.top - (this.state.clientY - clientY),
			clientX: clientX,
			clientY: clientY
		})
	}
	
	enableResize(event) {
		event.stopPropagation();
		
		this.setState({
			isResizing: true,
			isMoving: false,
			clientX: event.clientX,
			clientY: event.clientY
		})
	}
	
	disableInteraction() {
		this.setState({
			isMoving: false,
			isResizing: false
		})
	}
	
	resize(clientX, clientY) {
		const handlerRect = this.handler.getBoundingClientRect();
		this.setState({
			width: this.state.width + clientX - handlerRect.left - (handlerRect.width/2),
			height: this.state.height + clientY - handlerRect.top - (handlerRect.height/2)
		})
	}
	
	onCrop() {
		this.props.dispatch(pushHistory(this.props.layerID));
		
		const cropData = document.getElementById(this.props.layerIDPrefix + this.props.layerID).getContext('2d').getImageData(
			this.state.left,
			this.state.top,
			this.state.width,
			this.state.height
		);

		this.props.dispatch(resizeLayer(this.props.layerID, {
			width: this.state.width,
			height: this.state.height
		}));
		
		this.props.dispatch(putLayerImageData(this.props.layerID, cropData));
	}

	render() {
		return (
			<div
				className="Crop"
				onMouseMove={this.onMouseMove}
				onMouseUp={this.disableInteraction}
			>
				<div
					className="Crop-selection" 
					style={{
						top: this.state.top,
						left: this.state.left,
						width: this.state.width,
						height: this.state.height
					}}
					onMouseDown={this.enableMoving}
				>
					<div
						ref={element => this.handler = element}
						className="Crop-resize"
						onMouseDown={this.enableResize}
					></div>
					<div className="Crop-submit button" onClick={this.onCrop} >Crop!</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		layerIDPrefix: state.layers.idPrefix
	})
)(Crop);