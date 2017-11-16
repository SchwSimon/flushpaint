import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextBox from '../components/Tool-TextBox';
import Crop from '../components/Tool-Crop';
import { enableDrawing, enableMoving, disableInteraction,
 pushHistory, updatePosition, resizeLayer, removeLayer,
 setStrokeStyle, selectLayer, layerOperationDone,
 LAYER_OPERATION_FILL, LAYER_OPERATION_CLEAR, LAYER_OPERATION_COLORTOTRANSPARENT,
 LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE, LAYER_OPERATION_UNDO,
 LAYER_OPERATION_CROP, LAYER_OPERATION_CLONE, LAYER_OPERATION_MERGE } from '../actions/index';
import { GlobalCompositeOperations } from './Tool-GlobalCompositeOperation';
import { ToolList } from './Tool';

import '../styles/Layer.css';

export class Layer extends Component {
	constructor(props) {
		super(props);

    const drawboard = document.getElementById('Drawboard');
		this.state = {
			showTextbox: false,
			top: (drawboard.clientHeight/2) - (props.height/2),  // the layer's top position
			left: (drawboard.clientWidth/2) - (props.width/2)    // the layer's left position
		};

		this.onMouseDown = this.onMouseDown.bind(this);
		this.disableInteraction = this.disableInteraction.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onTextPrint = this.onTextPrint.bind(this);
    //this.onPositionUpdate = this.onPositionUpdate.bind(this);
	}

	componentDidMount() {
    this.onPositionUpdate();
		if (this.props.layerOperation && this.props.layerOperation.id === this.props.layerID)
		  this.doLayerOperation(this.props.layerOperation);
	}

  componentWillReceiveProps(nextProps) {
    if (nextProps.layerOperation && nextProps.layerOperation.id === nextProps.layerID)
			this.doLayerOperation(nextProps.layerOperation);
  }

  shouldComponentUpdate(nextProps, nextState) {
		if (this.props.settings.tool !== nextProps.settings.tool
			|| this.props.isSelected !== nextProps.isSelected
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.width !== prevProps.width
        || this.props.height !== prevProps.height
          || this.state.left !== prevState.left
            || this.state.top !== prevState.top)
      this.onPositionUpdate();
  }

  onPositionUpdate(update = false) {
    if (!update || this.state.positionUpdateTimeout) {
      clearTimeout(this.state.positionUpdateTimeout);
      return this.setState({
        positionUpdateTimeout: setTimeout(() => {
          this.setState({positionUpdateTimeout: null}, () => {
            this.onPositionUpdate(true);
          });
        }, 150)
      });
    }

    const clientRect = this.layer.getBoundingClientRect();
    this.props.dispatch(updatePosition(this.props.layerID, {
      left: clientRect.left,
      right: clientRect.right,
      top: clientRect.top,
      bottom: clientRect.bottom
    }));
  }

		// layer's mouse down handler
	onMouseDown(event) {
		// prevent right click
		if (event.button === 2) return;

		event.preventDefault();
		event.stopPropagation();

		const clientX = event.clientX;
		const clientY = event.clientY;

			// set the cursor's coordinates and the layer's offset position
		this.setState({
			clientX: clientX,
			clientY: clientY,
			offsetLeft: this.props.clientRect.left,
			offsetTop: this.props.clientRect.top
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
						toolClickX: clientX - this.props.clientRect.left,
						toolClickY: clientY - this.props.clientRect.top
					});
				default: return;
			}
		});
	}

	// on mouse move on this layer
	onMouseMove(event) {
		event.preventDefault();
		event.stopPropagation();
    if (this.props.interaction && this.props.interaction.layerID === this.props.layerID) {
      if (this.props.interaction.draw)
        this.draw(event.clientX, event.clientY);
      else if (this.props.interaction.move)
        this.move(event.clientX, event.clientY);
    }
	}

	// enable layer moving
	enableMoving() {
			// set this layer as selected layer
		this.props.dispatch(selectLayer(this.props.layerID));
			// enable moving
		this.props.dispatch(enableMoving(this.props.layerID));
	}

	// enable drawing for this layer
	enableDrawing() {
			// push history
    this.pushHistory();
			// set the layer's (canvas) context props
		const ctx = this.layer.getContext('2d');
		ctx.lineCap = this.props.settings.lineCap;
		ctx.lineWidth = this.props.settings.lineWidth;
		if (this.props.settings.tool === ToolList.ERASER) {
			ctx.strokeStyle = 'black';	// any color can be set to erase (unless the alpha is 1)
			ctx.globalCompositeOperation = GlobalCompositeOperations.DESTINATION_OUT;	// destination out will erase the color
		} else {
			ctx.strokeStyle = this.props.settings.strokeStyle;
			ctx.globalCompositeOperation = this.props.settings.globalCompositeOperation;
		}
			// enable drawing for this layer
    this.props.dispatch(enableDrawing(this.props.layerID));
			// trigger draw here to draw even if the user clicked only once without moving
		this.draw();
	}

	// disable the live interaction (drawing/moving)
	disableInteraction() {
    this.props.dispatch(disableInteraction());
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
		this.setState(prevState => ({
			left: prevState.left + (clientX - prevState.clientX),
			top: prevState.top + (clientY - prevState.clientY),
			clientX: clientX,
			clientY: clientY
		}));
	}

  // set the clicked color as selected color
	absorbColor() {
			// the pixel color data
		const color = this.layer.getContext('2d').getImageData(
			this.state.clientX - this.state.offsetLeft,
			this.state.clientY - this.state.offsetTop,
			1, 1
		).data;
			// set pixel color as selected color
		this.props.dispatch(setStrokeStyle(Array.from(color)));
	}

	// print a given text on to this layer
	onTextPrint(text, settings) {
    this.pushHistory();
		const ctx = this.layer.getContext('2d');
		ctx.font = settings.size + 'px arial';
		ctx.fillStyle = settings.color;
		ctx.fillText(text, settings.x, settings.y);
	}

  pushHistory(withPosition = false) {
    this.props.dispatch(pushHistory(
      this.props.layerID,
      this.layer.getContext('2d').getImageData(
				0, 0,
				this.layer.width,
				this.layer.height
			),
      (!withPosition) ? null : {
        left: this.state.left,
        top: this.state.top
      }
    ));
  }

	doLayerOperation(operation) {
    this.props.dispatch(layerOperationDone());

    const allowHistoryPush = !operation.preventHistoryPush;

		switch(operation.type) {
			case LAYER_OPERATION_FILL: {
        if (allowHistoryPush)
          this.pushHistory();
				const ctx = this.layer.getContext('2d');
				ctx.fillStyle = operation.color;
				ctx.rect(0, 0, this.layer.width, this.layer.height);
				ctx.globalCompositeOperation = GlobalCompositeOperations.SOURCE_OVER;
				ctx.fill();
        break;
			}

			case LAYER_OPERATION_CLEAR: {
        if (allowHistoryPush)
          this.pushHistory();
				const ctx = this.layer.getContext('2d');
				ctx.fillStyle = 'rgba(0,0,0,1)';
				ctx.rect(0, 0, this.layer.width, this.layer.height);
				ctx.globalCompositeOperation = GlobalCompositeOperations.DESTINATION_OUT;
				ctx.fill();
        break;
			}

			case LAYER_OPERATION_COLORTOTRANSPARENT: {
        if (allowHistoryPush)
          this.pushHistory();
				const ctx = this.layer.getContext('2d');
				const imgData = ctx.getImageData(0, 0, this.layer.width, this.layer.height);
				const px = imgData.data;
				const rgb = operation.color.split(',');
				rgb[0] = rgb[0].replace( /\D/g, '' );	// get numbers only
				rgb[1] = rgb[1].replace( /\D/g, '' );
				rgb[2] = rgb[2].replace( /\D/g, '' );
				for (let i = 0, len = px.length; i < len; i+=4) {
						// if the color is in tolerance
					if (Math.abs(px[i] - rgb[0]) + Math.abs(px[i+1] - rgb[1]) + Math.abs(px[i+2] - rgb[2]) <= 30) {
							// set the alpha channel for this pixel to 0 (transparent)
						px[i+3] = 0;
					}
				}
				ctx.putImageData(imgData, 0, 0);
        break;
			}

			case LAYER_OPERATION_IMAGEDATA:
        if (this.layer.width !== operation.imageData.width
            || this.layer.height !== operation.imageData.height)
          return setTimeout(() => {this.doLayerOperation(operation)}, 1);
        if (allowHistoryPush)
          this.pushHistory();
        this.layer.getContext('2d').putImageData(operation.imageData, 0, 0);
        break;

			case LAYER_OPERATION_IMAGE: {
        if (allowHistoryPush)
          this.pushHistory();
        if (!operation.opts)
          operation.opts = [
            (this.layer.width/2) - (operation.image.width/2),
            (this.layer.height/2) - (operation.image.height/2),
            operation.image.width,
  					operation.image.height
          ];
        const ctx = this.layer.getContext('2d');
        ctx.globalCompositeOperation = GlobalCompositeOperations.SOURCE_OVER;
				ctx.drawImage(
					operation.image,
					...operation.opts
				);
				break;
      }

      case LAYER_OPERATION_CROP: {
        if (allowHistoryPush)
          this.pushHistory(true);
        const imageData = this.layer.getContext('2d').getImageData(
          operation.cropData.left,
          operation.cropData.top,
          operation.cropData.width,
          operation.cropData.height
        );
        this.setState(prevState => ({
          left: prevState.left + operation.cropData.left,
          top: prevState.top + operation.cropData.top
        }));
        this.props.dispatch(resizeLayer(this.props.layerID, {
          width: operation.cropData.width,
          height: operation.cropData.height
        }));
        return this.doLayerOperation({
          type: LAYER_OPERATION_IMAGEDATA,
          imageData: imageData,
          preventHistoryPush: true
        });
      }

      case LAYER_OPERATION_CLONE:
        return this.doLayerOperation({
          type: LAYER_OPERATION_IMAGEDATA,
          imageData: document.getElementById(this.props.layerIdPrefix + operation.targetID)
            .getContext('2d').getImageData(0, 0, this.layer.width, this.layer.height),
          preventHistoryPush: true
        });

      case LAYER_OPERATION_MERGE: {
        const targetLayer = document.getElementById(this.props.layerIdPrefix + operation.targetID);
        const targetLayerRect = targetLayer.getBoundingClientRect();
        this.doLayerOperation({
          type: LAYER_OPERATION_IMAGE,
          image: targetLayer,
          opts: [
            -(this.props.clientRect.left - targetLayerRect.left),
            -(this.props.clientRect.top - targetLayerRect.top)
          ]
        })
        return this.props.dispatch(removeLayer(operation.targetID));
      }

      case LAYER_OPERATION_UNDO:
        if (operation.position)
          this.setState(prevState => ({
            left: operation.position.left,
            top: operation.position.top
          }));
        this.props.dispatch(resizeLayer(this.props.layerID, {
          width: operation.imageData.width,
          height: operation.imageData.height
        }));
        return this.doLayerOperation({
          type: LAYER_OPERATION_IMAGEDATA,
          imageData: operation.imageData,
          preventHistoryPush: true
        });

			default: break;
		}
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
					key={this.props.layerID}
					id={this.props.layerIdPrefix + this.props.layerID}
					className="canvas"
					ref={canvas => this.layer = canvas}
					width={this.props.width}
					height={this.props.height}
					onMouseDown={this.onMouseDown}
					onMouseMove={this.onMouseMove}
					onMouseUp={this.disableInteraction}
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
    interaction: state.layers.interaction,
		layerOperation: state.layers.layerOperation,			// an operation to execute on a specific layer
		layerIdPrefix: state.layers.idPrefix,							// the layer id prefix
		settings: state.settings													// the settings
	})
)(Layer);
