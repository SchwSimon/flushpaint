/**
 *		LIVE
 */
export const TOGGLE_DRAWING = 'TOGGLE_DRAWING';
export const TOGGLE_MOVING = 'TOGGLE_MOVING';
export const SET_INTERACTIONTIMEOUT = 'SET_INTERACTIONTIMEOUT';

export const toggleDrawing = (bool, layerID) => ({
	type: TOGGLE_DRAWING,
	bool,
	layerID
});
export const toggleMoving = (bool, layerID) => ({
	type: TOGGLE_MOVING,
	bool,
	layerID
});
export const setInteractionTimeout = (timeout) => ({
	type: SET_INTERACTIONTIMEOUT,
	timeout
});


/**
 *		SETTINGS
 */
export const SET_STROKESTYLE = 'SET_STROKESTYLE';
export const SET_LINEWIDTH = 'SET_LINEWIDTH';
export const SET_LINECAP = 'SET_LINECAP';
export const SET_GLOBALCOMPOSITEOPERATION = 'SET_GLOBALCOMPOSITEOPERATION';
export const SET_TOOL = 'SET_TOOL';

export const setStrokeStyle = (style) => ({
	type: SET_STROKESTYLE,
	style
});
export const setLineWidth = (width) => ({
	type: SET_LINEWIDTH,
	width
});
export const setLineCap = (cap) => ({
	type: SET_LINECAP,
	cap
});
export const setGlobalCompositeOperation = (operation) => ({
	type: SET_GLOBALCOMPOSITEOPERATION,
	operation
});
export const setTool = (tool) => ({
	type: SET_TOOL,
	tool
});


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
