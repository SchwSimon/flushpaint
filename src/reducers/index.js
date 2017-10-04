import { combineReducers } from 'redux';
import {
	SET_STROKESTYLE,
	SET_LINEWIDTH,
	SET_LINECAP,
	SET_GLOBALCOMPOSITEOPERATION,
	PUSH_HISTORY,
	UNDO_HISTORY
} from '../actions/index';

const initialState = {
	settings: {
		strokeStyle: 'rgba(0,0,0,1)',
		lineWidth: 4,
		lineCap: 'round',
		globalCompositeOperation: 'source-over'
	},
	history: {
		count: 0,
		data: []
	}
};

function settings(state = initialState.settings, action) {
	switch(action.type) {
		case SET_STROKESTYLE:
			return Object.assign({}, state, {
				strokeStyle: action.style
			});
		case SET_LINEWIDTH:
			return Object.assign({}, state, {
				lineWidth: action.width
			});
		case SET_LINECAP:
			return Object.assign({}, state, {
				lineCap: action.cap
			});
		case SET_GLOBALCOMPOSITEOPERATION:
			return Object.assign({}, state, {
				globalCompositeOperation: action.operation
			});
		default:
			return state;
	}
}

function history(state = initialState.history, action) {
	switch(action.type) {
		case PUSH_HISTORY: {
			let nextData = state.data.concat(action.data);
			let nextCount = state.count;
			if (state.count >= 50) {
				nextData.shift();
			} else {
				nextCount++;
			}
			return Object.assign({}, state, {
				data: nextData,
				count: nextCount
			});
		}
		case UNDO_HISTORY: {
			if ( !state.count ) return state;
			const dataCache = Object.assign([], state.data);
			dataCache.pop();
			return Object.assign({}, state, {
				data: dataCache,
				count: state.count - 1
			});
		}
		default:
			return state;
	}
}

const flushPaint = combineReducers({
	settings,
	history
});

export default flushPaint;