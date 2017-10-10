import { initialState } from './index';
import {
	TOGGLE_DRAWING,
	TOGGLE_MOVING,
	SET_INTERACTIONTIMEOUT
} from '../actions/live';

export function live(state = initialState.live, action) {
	switch(action.type) {
		case TOGGLE_DRAWING:
			return Object.assign({}, state, {
				isDrawing: action.bool,
				layerID: action.layerID || null
			}); 
		case TOGGLE_MOVING:
			return Object.assign({}, state, {
				isMoving: action.bool,
				layerID: action.layerID || null
			});
		case SET_INTERACTIONTIMEOUT:
			return Object.assign({}, state, {
				interactionTimeout: action.timeout
			});
		default: return state;
	}
}