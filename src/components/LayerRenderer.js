import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/LayerRenderer.css';

/**
 * Renders a collage of all the existing layers
 */
export class LayerRenderer extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isVisible: true,	// show the collage?
			cWidth: 0,				// the layers collage width
			cHeight: 0,				// the layers collage height
			sWidth: 0,				// the canvas style width
			sHeight: 0,				// the canvas style height
			xMin: 0,					// the smallest x coordinate of the layer
			yMin: 0						// the smallest y coordinate of the layer
		}

		this.showCollageImage = this.showCollageImage.bind(this);
	}

	componentWillReceiveProps(nextProps) {
			// hide the canvas if there are no layers
		if (!nextProps.layers.layers || nextProps.layers.layers.length === 0)
			return this.hideCanvas();

		this.updateThrottle(nextProps.layers.layers);

			// show the camvas if it was hidden
		this.showCanvas();
	}

	hideCanvas() {
		if (this.state.isVisible)
			this.setState({isVisible: false});
	}

	showCanvas() {
		if (!this.state.isVisible)
			this.setState({isVisible: true});
	}

	updateThrottle(layers, update = false) {
		if (!update || this.state.updateTimeout) {
      clearTimeout(this.state.updateTimeout);
      return this.setState({
        updateTimeout: setTimeout(() => {
          this.setState({updateTimeout: null}, () => {
            this.updateThrottle(layers, true);
          });
        }, 150)
      });
    }

		this.calculateLayerPositions(layers);
	}

	calculateLayerPositions(layers) {
			// get the min & max coordinates of the layers
		let xMin, xMax, yMin, yMax;
		layers.forEach((layer, index) => {
			if (index === 0) {
				xMin = layer.position.left;
				xMax = layer.position.right;
				yMin = layer.position.top;
				yMax = layer.position.bottom;
			} else {
				xMin = (layer.position.left < xMin) ? layer.position.left : xMin;
				xMax = (layer.position.right > xMax) ? layer.position.right : xMax;
				yMin = (layer.position.top < yMin) ? layer.position.top : yMin;
				yMax = (layer.position.bottom > yMax) ? layer.position.bottom : yMax;
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
				sHeight: sHeight,
				xMin: xMin,
				yMin: yMin
			}
		}, () => {
			this._renderCollage(layers);
		});
	}

	_renderCollage(layers) {
		const ctx = this.canvas.getContext('2d');
			// clear the collage first before redrawing
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			// render all the layers together in one canvas
		let visibleLayerCount = 0;
		layers.forEach(layer => {
			if (!layer.isVisible) return;
			visibleLayerCount++;
			ctx.drawImage(
				document.getElementById(this.props.layerIdPrefix + layer.id),
				layer.position.left - this.state.xMin,
				layer.position.top - this.state.yMin,
				layer.width,
				layer.height
			);
		});

			// hide canvas if there is no visible layer
		if (!visibleLayerCount)
			this.hideCanvas();
	}

		// open a new tab with the collage image
	showCollageImage() {
		window.open(this.canvas.toDataURL('image/png'));
	}

	render() {
		return (
			<div className="LayerRenderer" onClick={this.showCollageImage}>
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
		layerIdPrefix: state.layers.idPrefix,
		layers: state.layers	// only state.layers.layers is needed but for the updates we take the root
	})
)(LayerRenderer);
