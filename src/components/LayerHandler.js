import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import LayerDisplay from './LayerDisplay';
import { addLayer, fillLayer, clearLayer, mergeLayers, removeLayer,
 drawLayerImage, setColorToTransparent, cloneLayer, LAYER_OPERATION_IMAGE
} from '../actions/index';

import '../styles/LayerHandler.css';

// read and load an image from file
// callback with a loaded Image object
function loadImageFromFile(file, callback) {
	var fileReader = new FileReader();
	fileReader.addEventListener('load', function onLoad() {
		this.removeEventListener('load', onLoad, false);

		const image = new Image();
		image.addEventListener('load', function onLoad() {
			this.removeEventListener('load', onLoad, false);

			callback(this);
		}, false);
		image.src = this.result;
	}, false);
	fileReader.readAsDataURL(file);
}

/**
 * The layer handler block
 */
class LayerHandler extends PureComponent {
	constructor(props) {
		super(props);

		this.addLayer = this.addLayer.bind(this);
		this.fillLayer = this.fillLayer.bind(this);
		this.clearLayer = this.clearLayer.bind(this);
		this.removeLayer = this.removeLayer.bind(this);
		this.clone = this.clone.bind(this);
		this.merge = this.merge.bind(this);
		this.addImageLayer = this.addImageLayer.bind(this);
		this.insertImage = this.insertImage.bind(this);
		this.colorToTransparent = this.colorToTransparent.bind(this);
	}

	// add a new layer
	addLayer() {
		this.props.dispatch(addLayer({
			width: this.layerWidth.value,
			height: this.layerHeight.value
		}));
	}

	// add a new layer with the given input image
	addImageLayer(event) {
		const self = this;
		loadImageFromFile(event.target.files[0], image => {
				// add a new layer with the given layer operatoin
			self.props.dispatch(addLayer({
				width: image.width,
				height: image.height
			}, {
				type: LAYER_OPERATION_IMAGE,
				image: image,
				preventHistoryPush: true
			}));
		});
	}

	// insert an image to the selected layer
	insertImage(event) {
			// do nothing if no layer is selected
		if (!this.props.selectedLayerID) return;
			// load & draw image on to the selected layer
		loadImageFromFile(event.target.files[0], image => {
			this.props.dispatch(drawLayerImage(
				this.props.selectedLayerID,
				image
			));
		});
	}

	// fill the selected layer with the currently selected color
	fillLayer() {
		this.props.dispatch(fillLayer(this.props.selectedLayerID, this.props.selectedColor));
	}

	// make the selected layer fully transparent
	clearLayer() {
		this.props.dispatch(clearLayer(this.props.selectedLayerID));
	}

	// delete the selected layer
	removeLayer() {
		this.props.dispatch(removeLayer(this.props.selectedLayerID));
	}

	// turn the selected color with a tolerance to transparent on the selected layer
	colorToTransparent() {
		this.props.dispatch(setColorToTransparent(this.props.selectedLayerID, this.props.selectedColor));
	}

	// clone the selected layer
	clone() {
			// return is no layer is selected
		if (!this.props.selectedLayerID) return;
			// set the next layer content params
		this.props.dispatch(cloneLayer(this.props.selectedLayerID));
	}

	// merge the selected layer with the next lower layer
	merge() {
			// return if no layer is selected
		if (!this.props.selectedLayerID) return;
			// merge this layer onto the next (sub) layer
		this.props.dispatch(mergeLayers(this.props.selectedLayerID));
	}

	render() {
		return (
			<div className="LayerHandler">
				<LayerDisplay />
				<div className="LayerHandler-merge button" onClick={this.merge}>Merge downward</div>
				<div className="LayerHandler-insertimage button">
					insert image
					<input className="LayerHandler-fileinput" type="file" onChange={this.insertImage} accept="image/*" />
				</div>
				<div className="LayerHandler-duplicate button" onClick={this.clone}>Duplicate</div>
				<div className="LayerHandler-colortransparent button" onClick={this.colorToTransparent}>Color to transparent</div>
				<div className="LayerHandler-colorfill button" onClick={this.fillLayer}>Fill color</div>
				<div className="LayerHandler-clear button" onClick={this.clearLayer}>Clear</div>
				<div className="LayerHandler-remove button" onClick={this.removeLayer}>Remove</div>
				<div className="LayerHandler-addimagelayer button">
					Add image as layer
					<input className="LayerHandler-fileinput" type="file" onChange={this.addImageLayer} accept="image/*" />
				</div>
				<div className="LayerHandler-dimension">
					<span>W</span>
					<input className="LayerHandler-dimensionInput" ref={(input => this.layerWidth = input)} type="number" min="0" defaultValue="600" onChange={event => event.target.value *= 1} />
				</div>
				<div className="LayerHandler-dimension">
					<span>H</span>
					<input className="LayerHandler-dimensionInput" ref={(input => this.layerHeight = input)} type="number" min="0" defaultValue="400" onChange={event => event.target.value *= 1} />
				</div>
				<div className="LayerHandler-addlayer button" onClick={this.addLayer}>Add Layer</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		selectedColor: state.settings.strokeStyle,	// the selected color
		selectedLayerID: state.layers.selectedID,	// the selected layer id
		layers: state.layers.layers							// the layers array
	})
)(LayerHandler);
