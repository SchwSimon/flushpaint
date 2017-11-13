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
export const REMOVE_LAYER = 'REMOVE_LAYER';
export const SELECT_LAYER = 'SELECT_LAYER';
export const TOGGLE_LAYER = 'TOGGLE_LAYER';
export const SORT_LAYERS = 'SORT_LAYERS';
export const LAYER_PUSH_HISTORY = 'LAYER_PUSH_HISTORY';
export const LAYER_SET_TITLE = 'LAYER_SET_TITLE';
export const LAYER_OPERATION_FILL = 'LAYER_OPERATION_FILL';
export const LAYER_OPERATION_CLEAR = 'LAYER_OPERATION_CLEAR';
export const LAYER_OPERATION_MERGE = 'LAYER_OPERATION_MERGE';
export const LAYER_OPERATION_COLORTOTRANSPARENT = 'LAYER_OPERATION_COLORTOTRANSPARENT';
export const LAYER_OPERATION_RESIZE = 'LAYER_OPERATION_RESIZE';
export const LAYER_OPERATION_CROP = 'LAYER_OPERATION_CROP';
export const LAYER_OPERATION_IMAGEDATA = 'LAYER_OPERATION_IMAGEDATA';
export const LAYER_OPERATION_IMAGE = 'LAYER_OPERATION_IMAGE';
export const LAYER_OPERATION_CLONE = 'LAYER_OPERATION_CLONE';
export const LAYER_OPERATION_UNDO = 'LAYER_OPERATION_UNDO';
export const LAYER_OPERATION_DONE = 'LAYER_OPERATION_DONE';

export const addLayer = (dimensions, layerOperation) => ({
	type: ADD_LAYER,
	dimensions,
	layerOperation
});
export const cloneLayer = (layerID) => ({
	type: LAYER_OPERATION_CLONE,
	layerID
})
export const selectLayer = (layerID) => ({
	type: SELECT_LAYER,
	layerID
});
export const toggleLayer = (layerID) => ({
	type: TOGGLE_LAYER,
	layerID
});
export const sortLayers = (oldIndex, newIndex) => ({
	type: SORT_LAYERS,
	oldIndex,
	newIndex
});
export const fillLayer = (layerID, color) => ({
	type: LAYER_OPERATION_FILL,
	layerID,
	color
});
export const clearLayer = (layerID) => ({
	type: LAYER_OPERATION_CLEAR,
	layerID
});
export const removeLayer = (layerID) => ({
	type: REMOVE_LAYER,
	layerID
});
export const mergeLayers = (layerID) => ({
	type: LAYER_OPERATION_MERGE,
	layerID
});
export const setLayerTitle = (layerID, title) => ({
	type: LAYER_SET_TITLE,
	layerID,
	title
});
export const setColorToTransparent = (layerID, color) => ({
	type: LAYER_OPERATION_COLORTOTRANSPARENT,
	layerID,
	color
});
export const resizeLayer = (layerID, dimensions) => ({
	type: LAYER_OPERATION_RESIZE,
	layerID,
	dimensions
});
export const cropLayer = (layerID, cropData) => ({
	type: LAYER_OPERATION_CROP,
	layerID,
	cropData
})
export const putLayerImageData = (layerID, imageData) => ({
	type: LAYER_OPERATION_IMAGEDATA,
	layerID,
	imageData
});
export const drawLayerImage = (layerID, image) => ({
	type: LAYER_OPERATION_IMAGE,
	layerID,
	image
});
export const pushHistory = (layerID, imageData) => ({
	type: LAYER_PUSH_HISTORY,
	layerID,
	imageData
});
export const undoHistory = () => ({
	type: LAYER_OPERATION_UNDO
});
export const layerOperationDone = () => ({
	type: LAYER_OPERATION_DONE
})
