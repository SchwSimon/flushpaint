import { initialState } from './index';
import {
	SET_STROKESTYLE,
	SET_LINEWIDTH,
	SET_LINECAP,
	SET_GLOBALCOMPOSITEOPERATION,
	SET_TOOL
} from '../actions/index';

export function settings(state = initialState.settings, action) {
	switch(action.type) {
		case SET_STROKESTYLE: {
			const color = (typeof action.style.r !== 'undefined') ?
				action.style.r + ',' + action.style.g + ',' + action.style.b + ',' + action.style.a
				: action.style.join();
			return Object.assign({}, state, {
				strokeStyle: 'rgba(' + color + ')'
			});
		}
		case SET_LINEWIDTH:
			return Object.assign({}, state, {
				lineWidth: action.width*1
			});
		case SET_LINECAP:
			return Object.assign({}, state, {
				lineCap: action.cap
			});
		case SET_GLOBALCOMPOSITEOPERATION:
			return Object.assign({}, state, {
				globalCompositeOperation: action.operation
			});
		case SET_TOOL:
			return Object.assign({}, state, {
				tool: action.tool
			});
		default:
			return state;
	}
}