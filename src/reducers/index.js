import { combineReducers } from 'redux';
import {
	LineCaps,
	GlobalCompositeOperations,
	ToolList,
} from '../actions/index';

import { live } from './live';
import { settings } from './settings';
import {
	layers,
	generateNewLayerProps,
	DEFAULT_NEXTLAYERCONTENT,
	CURRENT_LAYER_ID,
	LAYER_ID_PREFIX
} from './layers';

export const initialState = {
	live: {
		isDrawing: false,
		isMoving: false,
		interactionTimeout: null,
		layerID: null
	},
	settings: {
		strokeStyle: 'rgba(0,0,0,1)',
		lineWidth: 10,
		lineCap: LineCaps.ROUND,
		globalCompositeOperation: GlobalCompositeOperations.SOURCE_OVER,
		tool: ToolList.BRUSH
	},
	layers: {
		selectedID: CURRENT_LAYER_ID,
		idPrefix: LAYER_ID_PREFIX,
		nextLayerContent: DEFAULT_NEXTLAYERCONTENT,
		layers: [generateNewLayerProps(CURRENT_LAYER_ID, 600, 400)],
		layersInOrder:[{id:CURRENT_LAYER_ID}],
		history: []
	}
};

const FlushPaint = combineReducers({
	live,
	settings,
	layers
});

export default FlushPaint;