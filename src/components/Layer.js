import React, { Component } from 'react';
import { connect } from 'react-redux';

import TextBox from '../components/Tool-TextBox';
import Crop from '../components/Tool-Crop';

import {
	toggleDrawing,
	toggleMoving,
	setInteractionTimeout,
	pushHistory,
	resizeLayer,
	ToolList,
	GlobalCompositeOperations,
	setStrokeStyle,
	selectLayer,
	fillLayer,
	layerContentTypes,
	setNextLayerContent
} from '../actions/index';

import '../styles/Layer.css';

class Layer extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			showTextbox: false,
			top: 0,	// the layer's top position
			left: 0	// the layer's left position
		};
		
		this.mouseDown = this.mouseDown.bind(this);
		this.disableInteraction = this.disableInteraction.bind(this);
		this.mouseMove = this.mouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onTextPrint = this.onTextPrint.bind(this);
	}
	
	componentDidMount() {
			// set the new layer's default content
		switch(this.props.nextLayerContent.type) {
			
				// make this layer a clone of the given source layer
			case layerContentTypes.CLONE: {
					// get the clone layer source
				const cloneSourceLayer = document.getElementById(this.props.layerIdPrefix + this.props.nextLayerContent.data);
					
					// resize this layer to the clone source dimensions
				this.props.dispatch(resizeLayer(this.props.layerID, {
					width: cloneSourceLayer.width,
					height: cloneSourceLayer.height
				}));
				
					// make async otherwise data will be lost..
				return setTimeout(() => {
						// put the clone source image data to this layer
					this.layer.getContext('2d').putImageData(
						cloneSourceLayer.getContext('2d').getImageData(0, 0, cloneSourceLayer.width, cloneSourceLayer.height),
						0, 0
					);
						// set the next layer's content back to default
					this.props.dispatch(setNextLayerContent());
						// center this layer
					this.centerLayer();
				}, 1);
			}
			
				// draw the given image on to this layer
			case layerContentTypes.IMAGE: {
				this.layer.getContext('2d').drawImage(
					this.props.nextLayerContent.data,
					0, 0,
					this.layer.width,
					this.layer.height
				);
			} break;
			
				// put the given image data on to this layer
			case layerContentTypes.IMAGEDATA: {
				this.layer.getContext('2d').putImageData(
					this.props.nextLayerContent.data,
					0, 0
				);
			} break;
			
				// fill this layer with the given color, this is also the default behaviour
			case layerContentTypes.FILLCOLOR:
			default: this.props.dispatch(fillLayer(this.props.layerID, this.props.nextLayerContent.data));
		}
			// set the next layer's content back to default
		this.props.dispatch(setNextLayerContent());
			// center this layer
		this.centerLayer();
	}
	
		// center the layer in relation to the drawboard
	centerLayer() {
		const drawboard = document.getElementById('Drawboard');
		this.setState({
			top: ((drawboard.clientHeight/2) - (this.layer.height/2)),
			left: ((drawboard.clientWidth/2) - (this.layer.width/2))
		});
	}
	
		// layer's mouse down handler
	mouseDown(event) {
		// prevent right click
		if (event.button === 2) return;
		
		event.preventDefault();
		event.stopPropagation();
		
		const clientX = event.clientX;
		const clientY = event.clientY;
		
		const clientRect = this.layer.getBoundingClientRect();
			// set the cursor's coordinates and the layer's offset position
		this.setState({
			clientX: clientX,
			clientY: clientY,
			offsetLeft: clientRect.left,
			offsetTop: clientRect.top
		}, () => {
			switch(this.props.settings.tool) {
				case ToolList.BRUSH:				// enable drawing
				case ToolList.ERASER:				// enable drawing transparency
					return this.enableDrawing();
				case ToolList.MOVE:					// enable layer moving
					return this.enableMoving();
				case ToolList.PIPETTE:				// get the clicked color 
					return this.absorbColor();
				case ToolList.TEXT:					// show text editor
					return this.setState({
						showTextbox: true,
						toolClickX: clientX - clientRect.left,
						toolClickY: clientY - clientRect.top
					});
				default: return;
			}
		});
	}
	
	// set the clicked color as selected color
	absorbColor() {
			// the pixel color data
		const color = this.layer.getContext( "2d" ).getImageData( 
			this.state.clientX - this.state.offsetLeft,
			this.state.clientY - this.state.offsetTop,
			1, 1
		).data;
			// set pixel color as selected color
		this.props.dispatch(setStrokeStyle(color));
	}
	
	// on mouse move on this layer
	mouseMove(event) {
		event.preventDefault();
		event.stopPropagation();
			// return if this layer id is not the live layer id
		if (this.props.layerID !== this.props.live.layerID) return;
			// clear the mouse out timeout
		clearTimeout(this.props.live.interactionTimeout);

		if (this.props.live.isDrawing)
			return this.draw(event.clientX, event.clientY);
		else if (this.props.live.isMoving)
			return this.move(event.clientX, event.clientY);
	}
	
	// enable layer moving for this layer
	enableMoving() {
			// clear the mouse out timeout
		clearTimeout(this.props.live.interactionTimeout);
			// set this layer as selected layer
		this.props.dispatch(selectLayer(this.props.layerID));
			// enable layer moving for this layer
		this.props.dispatch(toggleMoving(true, this.props.layerID));
	}
	
	// enable drawing for this layer
	enableDrawing() {
			// clear the mouse out timeout
		clearTimeout(this.props.live.interactionTimeout);
			// push history
		this.props.dispatch(pushHistory(this.props.layerID));
			// set the layer's (canvas) context props
		const ctx = this.layer.getContext('2d');
		ctx.lineCap = this.props.settings.lineCap;
		ctx.lineWidth = this.props.settings.lineWidth;
		if (this.props.settings.tool === ToolList.ERASER) {
			ctx.strokeStyle = "black";	// any color can be set to erase (unless the alpha is 1)
			ctx.globalCompositeOperation = GlobalCompositeOperations.DESTINATION_OUT;	// destination out will erase the color
		} else {
			ctx.strokeStyle = this.props.settings.strokeStyle;
			ctx.globalCompositeOperation = this.props.settings.globalCompositeOperation;
		}
			// enable drawing for this layer
		this.props.dispatch(toggleDrawing(true, this.props.layerID));
			// trigger draw here to draw even if the user clicked only once without moving
		this.draw();
	}
	
	// disable the live interaction (drawing/moving)
	disableInteraction() {
			// clear the mouse out timeout
		clearTimeout(this.props.live.interactionTimeout);
			// disable layer drawing
		this.props.dispatch(toggleDrawing(false));
			// disable layer moving
		this.props.dispatch(toggleMoving(false));
	}
	
	// start a timeout on layer mouse out to disable live interaction (drawing/moving)
	// when leaving the layer for more than x milliseconds
	onMouseOut() {
			// clear the mouse out timeout
		clearTimeout(this.props.live.interactionTimeout);
			// disable live interaction when leaving the live layer for 700 milliseconds
		this.props.dispatch(setInteractionTimeout(setTimeout(
			this.disableInteraction, 700
		)));
	}
	
	// draw on layer
	draw(clientX = this.state.clientX, clientY = this.state.clientY) {
		const toX = clientX - this.state.offsetLeft;
		const toY = clientY - this.state.offsetTop;
		const ctx = this.layer.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(toX, toY);
		ctx.lineTo(toX, toY + 0.1);
		ctx.stroke();
	}
	
	// move layer
	move(clientX, clientY) {
			// set the new layer's top/left position
			// set the new cursor's x/y position
		this.setState((prevState) => {
			return {
				left: prevState.left + (clientX - prevState.clientX),
				top: prevState.top + (clientY - prevState.clientY),
				clientX: clientX,
				clientY: clientY
			}
		});
	}
	
	// print a given text on to this layer
	onTextPrint(text, settings) {
		const ctx = this.layer.getContext('2d');
		ctx.font = settings.size + 'px arial';
		ctx.fillStyle = settings.color;
		ctx.fillText(text, settings.x, settings.y);
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.settings.tool !== nextProps.settings.tool) {
			this.disableInteraction();
			return true;
		}
		if (this.props.isSelected !== nextProps.isSelected
			|| this.props.isVisible !== nextProps.isVisible
				|| this.props.width !== nextProps.width
					|| this.props.height !== nextProps.height
						|| this.state.left !== nextState.left
							|| this.state.top !== nextState.top
								|| this.state.showTextbox !== nextState.showTextbox
									|| this.state.toolClickX !== nextState.toolClickX
										|| this.state.toolClickY !== nextState.toolClickY)
			return true;
		return false;
	}
	
	render() {
		return (
			<div 
				className={'Layer' + (this.props.isSelected ? ' selected' : '')}
				style={{
					display: (this.props.isVisible) ? 'block' : 'none',
					left: this.state.left,
					top: this.state.top,
					width: this.props.width,
					height: this.props.height
				}}
			>
				<canvas
					id={this.props.layerIdPrefix + this.props.layerID}
					key={this.props.layerID}
					className="canvas"
					ref={canvas => this.layer = canvas}
					width={this.props.width}
					height={this.props.height}
					onMouseDown={this.mouseDown}
					onMouseMove={this.mouseMove}
					onMouseUp={this.disableInteraction}
					onMouseOut={this.onMouseOut}
				></canvas>
				{this.props.settings.tool === ToolList.TEXT && this.state.showTextbox &&
					<TextBox
						layerID={this.props.layerID}
						posX={this.state.toolClickX}
						posY={this.state.toolClickY}
						onTextPrint={this.onTextPrint}
						hideTextbox={() => this.setState({showTextbox:false})}
					/>
				}
				{this.props.settings.tool === ToolList.CROP && this.props.isSelected &&
					<Crop
						layerID={this.props.layerID}
						layerWidth={this.props.width}
						layerHeight={this.props.height}
					/>
				}
			</div>
		);
	}
}

export default connect(
	state => ({
		live: state.live,														// the live interaction params
		nextLayerContent: state.layers.nextLayerContent,	// the next layer params
		layerIdPrefix: state.layers.idPrefix,							// the layer id prefix
		settings: state.settings											// the settings
	})
)(Layer);