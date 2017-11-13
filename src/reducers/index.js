import { combineReducers } from 'redux';

import { live } from './live';

import { settings } from './settings';
import { GlobalCompositeOperations } from '../components/Tool-GlobalCompositeOperation';
import { ToolList } from '../components/Tool';
import { LineCaps } from '../components/Tool-LineCap';

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
