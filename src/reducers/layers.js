import { initialState } from './index';
import {	arrayMove } from 'react-sortable-hoc';
import {
	ADD_LAYER,
	SELECT_LAYER,
	TOGGLE_LAYER,
	SORT_LAYERORDER,
	FILL_LAYER,
	CLEAR_LAYER,
	REMOVE_LAYER,
	MERGE_LAYERS,
	SET_LAYERTITLE,
	SET_NEXTLAYERCONTENT,
	SET_COLORTOTRANSPARENT,
	RESIZE_LAYER,
	PUT_LAYERIMAGEDATA,
	DRAW_LAYERIMAGE,
	PUSH_HISTORY,
	UNDO_HISTORY,
	layerContentTypes
} from '../actions/index';

// Auto incremented unqie layer IDs
export let CURRENT_LAYER_ID = 1;

export const LAYER_ID_PREFIX = 'Layer-';
export const DEFAULT_NEXTLAYERCONTENT = {
	type: layerContentTypes.FILLCOLOR,
	data: 'white'
};

export function generateNewLayerProps(id, width = 600, height = 400) {
	return {
		id: id,
		isVisible: true,
		width: width,
		height: height,
		title: 'Layer ' + id
	}
}

const MAX_HISTORY = 50;

export function layers(state = initialState.layers, action) {
	switch(action.type) {
		case ADD_LAYER: {
			CURRENT_LAYER_ID++;
			return Object.assign({}, state, {
				selectedID: CURRENT_LAYER_ID,
				layers: state.layers.concat([
					generateNewLayerProps(
						CURRENT_LAYER_ID,
						action.dimensions.width*1,
						action.dimensions.height*1
					)
				]),
				layersInOrder: [{id: CURRENT_LAYER_ID}].concat(state.layersInOrder)
			});
		}
		case SELECT_LAYER:
			return Object.assign({}, state, {
				selectedID: action.layerID*1
			});
		case TOGGLE_LAYER:
			return Object.assign({}, state, {
				layers: state.layers.map((layer) => {
					if (layer.id === action.layerID*1)
						layer.isVisible = !layer.isVisible
					return layer;
				})
			});
		case SORT_LAYERORDER: {
			const newState = Object.assign({}, state, {
				layersInOrder: arrayMove(state.layersInOrder, action.oldIndex, action.newIndex)
			});
			const drawboard = document.getElementById('Drawboard');
			newState.layersInOrder.forEach((layer) => {
				drawboard.insertBefore(
					document.getElementById(LAYER_ID_PREFIX + layer.id).parentNode,
					drawboard.firstChild
				);
			});
			return newState;
		}
		case FILL_LAYER: {
			if (!action.layerID) return state;
			const layer = document.getElementById(LAYER_ID_PREFIX + action.layerID);
			const ctx = layer.getContext('2d');
			ctx.fillStyle = action.color;
			ctx.rect( 0, 0, layer.width, layer.height );
			ctx.globalCompositeOperation = "source-over";
			ctx.fill();
			return state;
		}
		case CLEAR_LAYER: {
			if (!action.layerID) return state;
			const layer = document.getElementById(LAYER_ID_PREFIX + action.layerID);
			const ctx = layer.getContext('2d');
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.rect( 0, 0, layer.width, layer.height );
			ctx.globalCompositeOperation = "destination-out";
			ctx.fill();
			return state;
		}
		case REMOVE_LAYER: {
			if (!action.layerID) return state;
			return Object.assign({}, state, {
				selectedID: null,
				layers: state.layers.filter((layer) => {
					return layer.id !== action.layerID*1;
				}),
				layersInOrder: state.layersInOrder.filter((layer) => {
					return layer.id !== action.layerID*1;
				})
			});
		}
		case SET_COLORTOTRANSPARENT: {
			if (!action.layerID) return state;
			const layer = document.getElementById(LAYER_ID_PREFIX + action.layerID);
			const ctx = layer.getContext('2d');
			const imgData = ctx.getImageData(0, 0, layer.width, layer.height);
			const px = imgData.data;
			const rgb = action.color.split(',');
			rgb[0] = rgb[0].replace( /\D/g, "" );	// get numbers only
			rgb[1] = rgb[1].replace( /\D/g, "" );
			rgb[2] = rgb[2].replace( /\D/g, "" );
			for (let i = 0, len = px.length; i < len; i+=4) {
				if (Math.abs(px[i] - rgb[0]) + Math.abs(px[i+1] - rgb[1]) + Math.abs(px[i+2] - rgb[2]) <= 30) {
					// set the pixel to transparent if its color is in tolerance
					px[i+3] = 0;
				}
			}
			ctx.putImageData(imgData, 0, 0);
			return state;
		}
		case SET_LAYERTITLE: {
			return Object.assign({}, state, {
				layers: state.layers.map((layer, index) => {
					if (layer.id === action.layerID*1)
						layer.title = action.title;
					return layer;
				})
			});
		}
		case SET_NEXTLAYERCONTENT: {
			const content = action.content || DEFAULT_NEXTLAYERCONTENT;
			return Object.assign({}, state, {
				nextLayerContent: {
					type: content.type,
					data: content.data
				}
			});
		}
		case RESIZE_LAYER:
			return Object.assign({}, state, {
				layers: state.layers.map((layer) => {
					if (layer.id === action.layerID*1) {
						layer.width = action.dimensions.width*1;
						layer.height = action.dimensions.height*1;
					}
					return layer;
				})
			});
		case PUT_LAYERIMAGEDATA: {
			setTimeout(() => {
				// make async with timeout otherwise putted data will be lost
				document.getElementById(LAYER_ID_PREFIX + action.layerID)
					.getContext('2d')
						.putImageData(action.imageData, 0, 0);
			}, 1);
			return state;
		}
		case MERGE_LAYERS: {
			const layerSource = document.getElementById(LAYER_ID_PREFIX + action.sourceLayerID);
			const layerDest = document.getElementById(LAYER_ID_PREFIX + action.destLayerID);
			const sourceRect = layerSource.getBoundingClientRect();
			const destRect = layerDest.getBoundingClientRect();
			layerDest.getContext('2d').drawImage(
				layerSource,
				-(destRect.x - sourceRect.x),
				-(destRect.y - sourceRect.y)
			);
			return state;
		}
		case DRAW_LAYERIMAGE: {
			const layer = document.getElementById(LAYER_ID_PREFIX + action.layerID);
			layer.getContext('2d').drawImage(
				action.image,
				((layer.width/2) - (action.image.width/2)),
				((layer.height/2) - (action.image.height/2)),
				action.image.width,
				action.image.height
			);
			return state;
		}
		case PUSH_HISTORY: {
			if (!action.layerID) return state;
			const layer = document.getElementById(LAYER_ID_PREFIX + action.layerID);
			const nextData = state.history.concat({
				layerID: action.layerID,
				data: layer.getContext('2d').getImageData(
					0, 0,
					layer.width,
					layer.height
				)
			});
			if (state.history.length >= MAX_HISTORY)
				nextData.shift();
			return Object.assign({}, state, {
				history: nextData
			});
		}
		case UNDO_HISTORY: {
			if (!state.history.length) return state;
			let newHistory = Object.assign([], state.history);
			let popData = newHistory.pop();
			let layer = document.getElementById(LAYER_ID_PREFIX + popData.layerID);
			if ( !layer ) {
				newHistory = newHistory.filter((history) => {
					return history.layerID !== popData.layerID
				});
				popData = newHistory.pop();
				if (!popData) return Object.assign({}, state, {
					history: newHistory
				});
				layer = document.getElementById(LAYER_ID_PREFIX + popData.layerID);
			}
			let layers = Object.assign([], state.layers);
			if (layer.width !== popData.data.width || layer.height !== popData.data.height) {
				layer.width = popData.data.width;
				layer.height = popData.data.height;
				layers = state.layers.map((layer) => {
					if (layer.id === popData.layerID) {
						layer.width = popData.data.width;
						layer.height = popData.data.height;
					}
					return layer;
				});
			}
			setTimeout(() => {
				// make async with timeout otherwise putted data will be lost
				layer.getContext('2d').putImageData(popData.data, 0, 0);
			}, 1)
			return Object.assign({}, state, {
				layers: layers,
				history: newHistory
			});
		}
		default:
			return state;
	}
}