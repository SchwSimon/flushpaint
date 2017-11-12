import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/LayerRenderer.css';

/**
 * Renders a collage of all the existing layers
 */
class LayerRenderer extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isVisible: true,	// show the collage?
			cWidth: 0,			// the layers collage width
			cHeight: 0,		// the layers collage height,
			sWidth: 0,			// the canvas style width
			sHeight: 0			// the canvas style height
		}

		this.renderLayers = this.renderLayers.bind(this);
		this.showCollageImage = this.showCollageImage.bind(this);
	}

	componentDidMount() {
			// small timeout to fully render the canvas on mount
		setTimeout(this.renderLayers, 1);
	}

	componentWillUpdate() {
		this.renderLayers();
	}

	// render the collage
	renderLayers() {
		if (this.props.layers.length === 0) {
				// hide the collage preview if there are no layers
			return this.setState({isVisible: false});
		} else if (!this.state.isVisible) {
				// show the collage if it was hidden
			this.setState({isVisible: true});
		}

			// get the min & max coordinates of the layers
		let xMin, xMax, yMin, yMax;
		this.props.layers.forEach((layer, index) => {
			const layerRect = document.getElementById(this.props.layerIdPrefix + layer.id).getBoundingClientRect();
			if (index === 0) {
				xMin = layerRect.left;
				xMax = layerRect.right;
				yMin = layerRect.top;
				yMax = layerRect.bottom;
			} else {
				xMin = (layerRect.left < xMin) ? layerRect.left : xMin;
				xMax = (layerRect.right > xMax) ? layerRect.right : xMax;
				yMin = (layerRect.top < yMin) ? layerRect.top : yMin;
				yMax = (layerRect.bottom > yMax) ? layerRect.bottom : yMax;
			}
		});

			// set the new collage dimensions
		this.setState((prevState) => {
			const cWidth = xMax - xMin;
			const cHeight = yMax - yMin;

				// calculate the resize dimensions for the little preview container
			let sWidth, sHeight;
			if (cWidth > 220) {
				sWidth = 220;
				sHeight = Math.round(220 / (cWidth / cHeight));
			} else {
				sWidth = cWidth;
				sHeight = cHeight;
			}
			if (cHeight > 63) {
				sHeight = 63;
				sWidth = Math.round(63 / (cHeight / cWidth));
			}

			return {
				cWidth: cWidth,
				cHeight: cHeight,
				sWidth: sWidth,
				sHeight: sHeight
			}
		});

		const ctx = this.canvas.getContext('2d');
			// clear the collage first before redrawing
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			// make ansync to get sure to have the updated layers..
		setTimeout(() => {
				// reverse the orders to draw the images from the first (lowest z index) to the last (highest z index)
			this.props.layers.forEach(layer => {
				const canvas = document.getElementById(this.props.layerIdPrefix + layer.id)
				const layerRect = canvas.getBoundingClientRect();
				ctx.drawImage(
					canvas,
					layerRect.left - xMin,
					layerRect.top - yMin,
					canvas.width,
					canvas.height
				);
			});
		}, 99);
	}

		// open a new tab with the collage image
	showCollageImage() {
		window.open(this.canvas.toDataURL('image/png'));
	}

	render() {
		return (
			<div className="LayerRenderer" onClick={this.showCollageImage} onMouseEnter={this.renderLayers}>
				<canvas
					className="LayerRenderer-canvas"
					ref={canvas => this.canvas = canvas}
					width={this.state.cWidth}
					height={this.state.cHeight}
					style={{
						display: this.state.isVisible ? 'inline-block' : 'none',
						width: this.state.sWidth,
						height: this.state.sHeight
					}}
					onClick={this.showCollageImage}
				/>
				<div className="LayerRenderer-centerer"></div>
			</div>
		);
	}
}

export default connect(
	state => ({
		state: state,	// just for the updating
		layerIdPrefix: state.layers.idPrefix,				// the layer's id prefix
		layers: state.layers.layers		// the ordered layers array (ids only)
	})
)(LayerRenderer);
