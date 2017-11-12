import { combineReducers } from 'redux';
import {
	LineCaps,
	GlobalCompositeOperations,
	ToolList,
} from '../actions/index';

import { live } from './live';
import { settings } from './settings';
import layers, { layersInitialState } from './layers';

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
	layers: layersInitialState
};

const FlushPaint = combineReducers({
	live,
	settings,
	layers
});

export default FlushPaint;
