import layers, { layersInitialState } from '../../reducers/layers';
import layerIdHandler from '../../reducers/layers/layerIdHandler';
import generateLayerStructure, { LAYER_ID_PREFIX } from '../../reducers/layers/generateLayerStructure';
import { ADD_LAYER, SELECT_LAYER, TOGGLE_LAYER, SORT_LAYERORDER, LAYER_OPERATION_FILL,
 LAYER_OPERATION_CLEAR, REMOVE_LAYER, MERGE_LAYERS, SET_LAYERTITLE, SET_NEXTLAYERCONTENT,
 LAYER_OPERATION_COLORTOTRANSPARENT, LAYER_OPERATION_RESIZE, LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE,
 LAYER_OPERATION_CROP, PUSH_HISTORY, LAYER_OPERATION_UNDO, LAYER_OPERATION_DONE, layerContentTypes } from '../../actions/index';
import { arrayMove } from 'react-sortable-hoc';

describe('reducer: layers', () => {
  const defaultState = {
    selectedID: null,
    idPrefix: LAYER_ID_PREFIX,
    nextLayerContent: {
      type: layerContentTypes.FILLCOLOR,
      data: 'white'
    },
    layers: [],
    layerOperation: null,
    history: [],
    maxHistory: 50
  };

	it('initial state', () => {
		expect(layersInitialState).toEqual(defaultState);
  });

	it('return initialState on default action', () => {
		expect(layers(undefined, {type: null})).toEqual(defaultState);
  });

  describe('ADD_LAYER', () => {
    const state = {
      selectedID: null,
      layers: [],
    };
    const action = {
      type: ADD_LAYER,
      dimensions: {
        width: 300,
        height: 300
      }
    };

    it('must set the selected layer id to the new created layer\'s id', () => {
      const nextLayerId = layerIdHandler.current()+1;
  		expect(layers(state, action).selectedID).toBe(nextLayerId);
    });

    it('must push the new layer to the layers key', () => {
      const nextLayerId = layerIdHandler.current()+1;
  		expect(layers(state, action).layers).toEqual(
        defaultState.layers.concat([generateLayerStructure(nextLayerId, 300, 300)])
      );
    });
  });

  describe('REMOVE_LAYER', () => {
    const state = {
      selectedID: 1,
      layers: [generateLayerStructure(1, 300, 300)],
      history: [{id:1},{id:3},{id:1}]
    };
    const action = {
      type: REMOVE_LAYER,
      layerID: 1
    };

    it('must NOT change the selectedID', () => {
      action.layerID = 3;
  		expect(layers(state, action).selectedID).toBe(1);
    });

    it('must set the selectedID to null', () => {
      action.layerID = 1;
  		expect(layers(state, action).selectedID).toBe(null);
    });

    it('must remove the layer with the given id', () => {
  		expect(layers(state, action).layers).toEqual([]);
    });

    it('must remove all history elements with the removed layer id', () => {
      expect(layers(state, action).history).toEqual([{
        id: 3
      }]);
    });

    it('must force layerID to type number', () => {
      action.layerID = '1';
  		expect(layers(state, action).layers).toEqual([]);
    });
  });

  describe('SELECT_LAYER', () => {
    const state = {
      selectedID: null
    };
    const action = {
      type: SELECT_LAYER,
      layerID: 3
    };

    it('must set the selected layer id the correct id', () => {
  		expect(layers(state, action)).toEqual({
        selectedID: 3
      });
    });

    it('must force layerID to type number', () => {
      action.layerID = '3';
  		expect(layers(state, action)).toEqual({
        selectedID: 3
      });
    });
  });

  describe('TOGGLE_LAYER', () => {
    const state = {
      layers: [{
        id: 1,
        isVisible: true
      }]
    };
    const action = {
      type: TOGGLE_LAYER,
      layerID: 1
    };

    it('must toggle the layer\'s isVisible prop', () => {
  		expect(layers(state, action).layers[0].isVisible).toBe(!state.layers[0].isVisible);
    });

    it('must force layerID to type number', () => {
      action.layerID = '1';
  		expect(layers(state, action).layers[0].isVisible).toBe(!state.layers[0].isVisible);
    });
  });

  describe('SORT_LAYERORDER', () => {
    it('must swap array element by the given indexes', () => {
      const action = {
        type: SORT_LAYERORDER,
        oldIndex: 0,
        newIndex: 2
      };
      const state = {
        layers: ['index_0','index_1','index_2']
      };
  		expect(layers(state, action).layers).toEqual(
        arrayMove(state.layers, action.oldIndex, action.newIndex)
      );
    });
  });

  describe('LAYER_OPERATION_RESIZE', () => {
    const action = {
      type: LAYER_OPERATION_RESIZE,
      layerID: 1,
      dimensions: {
        width: 100,
        height: 200
      }
    };
    const state = {
      layers: [{
        id: 1,
        width: 500,
        height: 500
      }]
    };

    it('must set the layer\' dimensions', () => {
      expect(layers(state, action).layers[0]).toEqual({
        id: 1,
        width: 100,
        height: 200
      });
    });

    it('must force layerID to type number', () => {
      action.layerID = '1';
      expect(layers(state, action).layers[0]).toEqual({
        id: 1,
        width: 100,
        height: 200
      });
    });
  });

  describe('Layer operations', () => {
    let state;
    let action;
    beforeEach(() => {
      state = {
        layerOperation: null
      };
      action = {
        layerID: 1
      };
    });

    describe('LAYER_OPERATION_DONE', () => {
      it('must set the layerOperation to null', () => {
        state.layerOperation = 'not null';
        action.type = LAYER_OPERATION_DONE;
    		expect(layers(state, action).layerOperation).toBe(null);
      });
    });

    describe('LAYER_OPERATION_FILL', () => {
      it('must set the right layer operation', () => {
        action.type = LAYER_OPERATION_FILL;
        action.color = 'black';
    		expect(layers(state, action)).toEqual({
          layerOperation: {
            id: 1,
            type: LAYER_OPERATION_FILL,
            color: 'black'
          }
        });
      });
    });

    describe('LAYER_OPERATION_CLEAR', () => {
      it('must set the right layer operation', () => {
        action.type = LAYER_OPERATION_CLEAR;
        expect(layers(state, action)).toEqual({
          layerOperation: {
            id: 1,
            type: LAYER_OPERATION_CLEAR
          }
        });
      });
    });

    describe('LAYER_OPERATION_COLORTOTRANSPARENT', () => {
      it('must set the right layer operation', () => {
        action.type = LAYER_OPERATION_COLORTOTRANSPARENT;
        action.color = 'red';
        expect(layers(state, action)).toEqual({
          layerOperation: {
            id: 1,
            type: LAYER_OPERATION_COLORTOTRANSPARENT,
            color: 'red'
          }
        });
      });
    });

    describe('LAYER_OPERATION_IMAGEDATA', () => {
      it('must set the right layer operation', () => {
        action.type = LAYER_OPERATION_IMAGEDATA;
        action.imageData = 'image data';
        expect(layers(state, action)).toEqual({
          layerOperation: {
            id: 1,
            type: LAYER_OPERATION_IMAGEDATA,
            imageData: 'image data'
          }
        });
      });
    });

    describe('LAYER_OPERATION_IMAGE', () => {
      it('must set the right layer operation', () => {
        action.type = LAYER_OPERATION_IMAGE;
        action.image = 'image';
        expect(layers(state, action)).toEqual({
          layerOperation: {
            id: 1,
            type: LAYER_OPERATION_IMAGE,
            image: 'image'
          }
        });
      });
    });

    describe('LAYER_OPERATION_CROP', () => {
      it('must set the right layer operation', () => {
        action.type = LAYER_OPERATION_CROP;
        action.cropData = 'crop data'
        expect(layers(state, action)).toEqual({
          layerOperation: {
            id: 1,
            type: LAYER_OPERATION_CROP,
            cropData: 'crop data'
          }
        });
      });
    });

    describe('LAYER_OPERATION_UNDO', () => {
      beforeEach(() => {
        action.type = LAYER_OPERATION_UNDO;
        state.history = [{},{},{
          layerID: 1,
          data: 'image data'
        }];
      });

      it('must set the right layer operation', () => {
        expect(layers(state, action).layerOperation).toEqual({
          id: 1,
          type: LAYER_OPERATION_UNDO,
          imageData: 'image data'
        });
      });

      it('must pop the last history element', () => {
        expect(layers(state, action).history).toEqual([{},{}]);
      });

      it('must return default on empty history', () => {
        state.history = [];
        expect(layers(state, action)).toEqual(state);
      });
    });
  });
});
