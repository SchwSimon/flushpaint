import { SET_STROKESTYLE, SET_LINEWIDTH, SET_LINECAP,
 SET_GLOBALCOMPOSITEOPERATION, SET_TOOL } from '../actions/index';
import { GlobalCompositeOperations } from '../components/Tool-GlobalCompositeOperation';
import { ToolList } from '../components/Tool';
import { LineCaps } from '../components/Tool-LineCap';

export const settingsInitialState = {
	strokeStyle: 'rgba(0,0,0,1)',
	lineWidth: 10,
	lineCap: LineCaps.ROUND,
	globalCompositeOperation: GlobalCompositeOperations.SOURCE_OVER,
	tool: ToolList.BRUSH
};

const settings = (state = settingsInitialState, action) => {
	switch(action.type) {
		case SET_STROKESTYLE: {
			const color = (Array.isArray(action.strokeStyle))
				? action.strokeStyle.join(',')
				: action.strokeStyle.r + ',' + action.strokeStyle.g + ',' + action.strokeStyle.b + ',' + action.strokeStyle.a
			return Object.assign({}, state, {
				strokeStyle: 'rgba(' + color + ')'
			});
		}

		case SET_LINEWIDTH:
			return Object.assign({}, state, {
				lineWidth: action.lineWidth*1
			});

		case SET_LINECAP:
			return Object.assign({}, state, {
				lineCap: action.lineCap
			});

		case SET_GLOBALCOMPOSITEOPERATION:
			return Object.assign({}, state, {
				globalCompositeOperation: action.globalCompositeOperation
			});

		case SET_TOOL:
			return Object.assign({}, state, {
				tool: action.tool
			});

		default: break;
	}

	return state;
}

export default settings;
