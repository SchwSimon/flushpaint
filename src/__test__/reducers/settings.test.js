import settings, { settingsInitialState } from '../../reducers/settings';
import { SET_STROKESTYLE, SET_LINEWIDTH, SET_LINECAP,
 SET_GLOBALCOMPOSITEOPERATION, SET_TOOL } from '../../actions/index';
import { GlobalCompositeOperations } from '../../components/Tool-GlobalCompositeOperation';
import { ToolList } from '../../components/Tool';
import { LineCaps } from '../../components/Tool-LineCap';

describe('reducer: settings', () => {
  const defaultState = {
    strokeStyle: 'rgba(0,0,0,1)',
  	lineWidth: 10,
  	lineCap: LineCaps.ROUND,
  	globalCompositeOperation: GlobalCompositeOperations.SOURCE_OVER,
  	tool: ToolList.BRUSH
  };

	it('initial state', () => {
		expect(settingsInitialState).toEqual(defaultState);
  });

	it('return initialState on default action', () => {
		expect(settings(undefined, {type: null})).toEqual(defaultState);
  });

  describe('SET_STROKESTYLE', () => {
    const action = {
      type: SET_STROKESTYLE
    };

    it('must correctly set the strokestyle if array', () => {
      action.strokeStyle = ['1','2','3','4'];
  		expect(settings(undefined, action).strokeStyle).toBe('rgba(1,2,3,4)');
    });

    it('must correctly set the strokestyle if object', () => {
      action.strokeStyle = {
        r: 1,
        g: 2,
        b: 3,
        a: 4
      };
      expect(settings(undefined, action).strokeStyle).toBe('rgba(1,2,3,4)');
    });
  });

  describe('SET_LINEWIDTH', () => {
    const action = {
      type: SET_LINEWIDTH,
      lineWidth: 100
    };

    it('must correctly set the line width', () => {
  		expect(settings(undefined, action).lineWidth).toBe(100);
    });

    it('must force the line width to be type number', () => {
      action.lineWidth = '100';
      expect(settings(undefined, action).lineWidth).toBe(100);
    });
  });

  describe('SET_LINECAP', () => {
    const action = {
      type: SET_LINECAP,
      lineCap: 'line cap'
    };

    it('must correctly set the line cap', () => {
  		expect(settings(undefined, action).lineCap).toBe('line cap');
    });
  });

  describe('SET_GLOBALCOMPOSITEOPERATION', () => {
    const action = {
      type: SET_GLOBALCOMPOSITEOPERATION,
      globalCompositeOperation: 'gc operation'
    };

    it('must correctly set the global composite operation', () => {
  		expect(settings(undefined, action).globalCompositeOperation).toBe('gc operation');
    });
  });

  describe('SET_TOOL', () => {
    const action = {
      type: SET_TOOL,
      tool: 'tool'
    };

    it('must correctly set the global composite operation', () => {
  		expect(settings(undefined, action).tool).toBe('tool');
    });
  });
});
