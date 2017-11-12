/**
 *		LIVE
 */
export const TOGGLE_DRAWING = 'TOGGLE_DRAWING';
export const TOGGLE_MOVING = 'TOGGLE_MOVING';
export const SET_INTERACTIONTIMEOUT = 'SET_INTERACTIONTIMEOUT';

export function toggleDrawing(bool, layerID) {
	return { type: TOGGLE_DRAWING, bool, layerID }
}
export function toggleMoving(bool, layerID) {
	return { type: TOGGLE_MOVING, bool, layerID }
}
export function setInteractionTimeout(timeout) {
	return { type: SET_INTERACTIONTIMEOUT, timeout }
}


/**
 *		SETTINGS
 */
export const SET_STROKESTYLE = 'SET_STROKESTYLE';
export const SET_LINEWIDTH = 'SET_LINEWIDTH';
export const SET_LINECAP = 'SET_LINECAP';
export const SET_GLOBALCOMPOSITEOPERATION = 'SET_GLOBALCOMPOSITEOPERATION';
export const SET_TOOL = 'SET_TOOL';
export const LineCaps = {
	ROUND: 'round',
	SQUARE: 'square',
	BUTT: 'butt'
};
export const GlobalCompositeOperations = {
	SOURCE_OVER: 'source-over',
	SOURCE_IN: 'source-in',
	SOURCE_OUT: 'source-out',
	SOURCE_ATOP: 'source-atop',
	DESTINATION_OVER: 'destination-over',
	DESTINATION_IN: 'destination-in',
	DESTINATION_OUT: 'destination-out',
	DESTINATION_ATOP: 'destination-atop',
	LIGHTER: 'lighter',
	COPY: 'copy',
	XOR: 'xor',
	MULTIPLY: 'multiply',
	SCREEN: 'screen',
	OVERLAY: 'overlay',
	DARKEN: 'darken',
	LIGHTEN: 'lighten',
	COLOR_DODGE: 'color-dodge',
	COLOR_BURN: 'color-burn',
	HARD_LIGHT: 'hard-light',
	SOFT_LIGHT: 'soft-light',
	DIFFERENCE: 'difference',
	EXCLUSION: 'exclusion',
	HUE: 'hue',
	SATURATION: 'saturation',
	COLOR: 'color',
	LUMINOSITY: 'luminosity'
};
export const ToolList = {
	BRUSH: 'BRUSH',
	ERASER: 'ERASER',
	PIPETTE: 'PIPETTE',
	CROP: 'CROP',
	MOVE: 'MOVE',
	TEXT: 'TEXT'
};
export const layerContentTypes = {
	IMAGE: 'image',
	IMAGEDATA: 'image-data',
	CLONE: 'clone',
	FILLCOLOR: 'fillcolor'
}

export function setStrokeStyle(style) {
	return { type: SET_STROKESTYLE, style };
}
export function setLineWidth(width) {
	return { type: SET_LINEWIDTH, width };
}
export function setLineCap(cap) {
	return { type: SET_LINECAP, cap };
}
export function setGlobalCompositeOperation(operation) {
	return { type: SET_GLOBALCOMPOSITEOPERATION, operation };
}
export function setTool(tool) {
	return { type: SET_TOOL, tool };
}


/**
 *		LAYERS
 */
export const ADD_LAYER = 'ADD_LAYER';
export const SELECT_LAYER = 'SELECT_LAYER';
export const TOGGLE_LAYER = 'TOGGLE_LAYER';
export const SORT_LAYERORDER = 'SORT_LAYERORDER';
export const LAYER_OPERATION_FILL = 'LAYER_OPERATION_FILL';
export const LAYER_OPERATION_CLEAR = 'LAYER_OPERATION_CLEAR';
export const REMOVE_LAYER = 'REMOVE_LAYER';
export const MERGE_LAYERS = 'MERGE_LAYERS';
export const SET_LAYERTITLE = 'SET_LAYERTITLE';
export const SET_NEXTLAYERCONTENT = 'SET_NEXTLAYERCONTENT';
export const LAYER_OPERATION_COLORTOTRANSPARENT = 'LAYER_OPERATION_COLORTOTRANSPARENT';
export const LAYER_OPERATION_RESIZE = 'LAYER_OPERATION_RESIZE';
export const LAYER_OPERATION_CROP = 'LAYER_OPERATION_CROP';
export const LAYER_OPERATION_IMAGEDATA = 'LAYER_OPERATION_IMAGEDATA';
export const LAYER_OPERATION_IMAGE = 'LAYER_OPERATION_IMAGE';
export const PUSH_HISTORY = 'PUSH_HISTORY';
export const LAYER_OPERATION_UNDO = 'LAYER_OPERATION_UNDO';
export const LAYER_OPERATION_DONE = 'LAYER_OPERATION_DONE';

export function addLayer(dimensions) {
	return { type: ADD_LAYER, dimensions };
}
export function selectLayer(layerID) {
	return { type: SELECT_LAYER, layerID };
}
export function toggleLayer(layerID) {
	return { type: TOGGLE_LAYER, layerID };
}
export function sortLayersOrder(oldIndex, newIndex) {
	return { type: SORT_LAYERORDER, oldIndex, newIndex };
}
export function fillLayer(layerID, color) {
	return { type: LAYER_OPERATION_FILL, layerID, color };
}
export function clearLayer(layerID) {
	return { type: LAYER_OPERATION_CLEAR, layerID };
}
export function removeLayer(layerID) {
	return { type: REMOVE_LAYER, layerID };
}
export function mergeLayers(sourceLayerID, destLayerID) {
	return { type: MERGE_LAYERS, sourceLayerID, destLayerID };
}
export function setLayerTitle(layerID, title) {
	return { type: SET_LAYERTITLE, layerID, title }
}
export function setNextLayerContent(content) {
	return { type: SET_NEXTLAYERCONTENT, content }
}
export function setColorToTransparent(layerID, color) {
	return { type: LAYER_OPERATION_COLORTOTRANSPARENT, layerID, color }
}
export function resizeLayer(layerID, dimensions) {
	return { type: LAYER_OPERATION_RESIZE, layerID, dimensions }
}
export const cropLayer = (layerID, cropData) => ({
	type: LAYER_OPERATION_CROP,
	layerID,
	cropData
})
export function putLayerImageData(layerID, imageData) {
	return { type: LAYER_OPERATION_IMAGEDATA, layerID, imageData }
}
export function drawLayerImage(layerID, image) {
	return { type: LAYER_OPERATION_IMAGE, layerID, image }
}
export function pushHistory(layerID) {
	return { type: PUSH_HISTORY, layerID };
}
export function undoHistory() {
	return { type: LAYER_OPERATION_UNDO };
}
export const layerOperationDone = () => ({
	type: LAYER_OPERATION_DONE
})
