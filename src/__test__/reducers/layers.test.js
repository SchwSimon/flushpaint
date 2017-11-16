import layers, { layersInitialState } from '../../reducers/layers';
import { INTERACTION_ENABLE_DRAWING, INTERACTION_ENABLE_MOVING, INTERACTION_DISABLE,
 ADD_LAYER, REMOVE_LAYER, SELECT_LAYER, TOGGLE_LAYER, SORT_LAYERS,
 LAYER_PUSH_HISTORY, LAYER_UPDATE_POSITION, LAYER_SET_TITLE, LAYER_OPERATION_FILL,
 LAYER_OPERATION_CLEAR, LAYER_OPERATION_MERGE, LAYER_OPERATION_COLORTOTRANSPARENT,
 LAYER_OPERATION_RESIZE, LAYER_OPERATION_CROP, LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE,
 LAYER_OPERATION_CLONE, LAYER_OPERATION_UNDO, LAYER_OPERATION_DONE } from '../../actions/index';
import layerIdHandler from '../../reducers/layers/layerIdHandler';
import generateLayerStructure, { LAYER_ID_PREFIX } from '../../reducers/layers/generateLayerStructure';
import { arrayMove } from 'react-sortable-hoc';

describe('reducer: layers', () => {
  const defaultState = {
    selectedID: null,
    idPrefix: LAYER_ID_PREFIX,
    interaction: null,
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

  describe('interactions', () => {
    const action = {
      layerID: 2
    };

    describe('INTERACTION_ENABLE_DRAWING', () => {
      it('must set the drawing interaction state', () => {
        action.type = INTERACTION_ENABLE_DRAWING;
    		expect(layers(undefined, action).interaction).toEqual({
          layerID: 2,
          draw: true
        });
      });
    });

    describe('INTERACTION_ENABLE_MOVING', () => {
      it('must set the drawing interaction state', () => {
        action.type = INTERACTION_ENABLE_MOVING;
    		expect(layers(undefined, action).interaction).toEqual({
          layerID: 2,
          move: true
        });
      });
    });

    describe('INTERACTION_DISABLE', () => {
      it('must set the interaction state to null', () => {
        action.type = INTERACTION_DISABLE;
    		expect(layers(undefined, action).interaction).toBeNull();
      });
    });
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

    it('must set the default layerOperation', () => {
  		expect(layers(state, action).layerOperation).toEqual({
        id: layerIdHandler.current(),
        type: LAYER_OPERATION_FILL,
        color: 'white',
        preventHistoryPush: true
      });
    });

    it('must set the given layerOperation and add the current layer id to it', () => {
      action.layerOperation = {someProp: 1};
  		expect(layers(state, action).layerOperation).toEqual({
        id: layerIdHandler.current(),
        someProp: 1
      });
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
  		expect(layers(state, action).selectedID).toBeNull();
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

  describe('SORT_LAYERS', () => {
    it('must swap array element by the given indexes', () => {
      const action = {
        type: SORT_LAYERS,
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

  describe('LAYER_PUSH_HISTORY', () => {
    const action = {
      type: LAYER_PUSH_HISTORY,
      layerID: 1,
      imageData: 'image data',
      position: 'position'
    };

    it('must add a new history element', () => {
      const state = {
        history: []
      };

  		expect(layers(state, action).history).toEqual([{
        layerID: action.layerID,
        imageData: action.imageData,
        position: action.position
      }]);
    });

    it('must remove the first history element if max history is reached', () => {
      const state = {
        history: [{},{}],
        maxHistory: 2
      };
  		expect(layers(state, action).history).toEqual([{}, {
        layerID: action.layerID,
        imageData: action.imageData,
        position: action.position
      }]);
    });
  });

  describe('LAYER_UPDATE_POSITION', () => {
    const state = {
      layers: [{
        id: 1,
        position: null
      }]
    };
    const action = {
      type: LAYER_UPDATE_POSITION,
      layerID: 1,
      position: 'position'
    };

    it('must update the layer\s position', () => {
  		expect(layers(state, action).layers[0].position).toBe('position');
    });

    it('must force layerID to type number', () => {
      action.layerID = '1';
      expect(layers(state, action).layers[0].position).toBe('position');
    });
  });

  describe('Layer information setter', () => {
    describe('LAYER_SET_TITLE', () => {
      const layerRetitled = {
        id: 1,
        title: 'title'
      };
      const state = {
        layers: [{
          id: 1,
          title: 'not set'
        }]
      };
      const action = {
        type: LAYER_SET_TITLE,
        layerID: 1,
        title: 'title'
      };

      it('must set the layer\'s title', () => {
        expect(layers(state, action).layers[0]).toEqual(layerRetitled);
      });

      it('must force layerID to type number', () => {
        action.layerID = '1';
        expect(layers(state, action).layers[0]).toEqual(layerRetitled);
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
    		expect(layers(state, action).layerOperation).toBeNull();
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
      beforeEach(() => {
        action.type = LAYER_OPERATION_CROP;
        action.cropData = {
          width: 50,
          height: 50
        };
      })

      it('must set the right layer operation', () => {
        expect(layers(state, action).layerOperation).toEqual({
          id: 1,
          type: LAYER_OPERATION_CROP,
          cropData: action.cropData
        });
      });
    });

    describe('LAYER_OPERATION_RESIZE', () => {
      beforeEach(() => {
        action.type = LAYER_OPERATION_RESIZE;
        action.dimensions = {
          width: 100,
          height: 200
        };
        state.layers = [{
          id: 1,
          width: 500,
          height: 500
        }];
      });
      const layerResized = {
        id: 1,
        width: 100,
        height: 200
      };

      it('must set the layer\'s dimensions', () => {
        expect(layers(state, action).layers[0]).toEqual(layerResized);
      });

      it('must force layerID to type number', () => {
        action.layerID = '1';
        expect(layers(state, action).layers[0]).toEqual(layerResized);
      });
    });

    describe('LAYER_OPERATION_MERGE', () => {
      const targetID = 1;
      beforeEach(() => {
        action.type = LAYER_OPERATION_MERGE;
        action.layerID = 2;
        state.layers = [
          {id: targetID},
          {id:2}
        ];
        state.selectedID = 2;
      });

      it('must set the selected id to the target layer\'s id', () => {
        expect(layers(state, action).selectedID).toEqual(targetID);
      });

      it('must force layerID to type number', () => {
        action.layerID = '2';
        expect(layers(state, action).selectedID).toEqual(targetID);
      });

      it('must set the right layer operation', () => {
        expect(layers(state, action).layerOperation).toEqual({
          id: targetID,
          type: LAYER_OPERATION_MERGE,
          targetID: action.layerID
        });
      });
    });

    describe('LAYER_OPERATION_CLONE', () => {
      const cloneTarget = {
        id: 1,
        title: 'title'
      };
      beforeEach(() => {
        action.type = LAYER_OPERATION_CLONE;
        state.layers = [cloneTarget];
        state.selectedID = null;
      });

      it('must set the selected id to the clone\'s id', () => {
        expect(layers(state, action).selectedID).toEqual(layerIdHandler.current());
      });

      it('must create a copy op the target layer except the id and title', () => {
        expect(layers(state, action).layers).toEqual([cloneTarget, {
          id: layerIdHandler.current(),
          title: cloneTarget.title + ' (copy)'
        }]);
      });

      it('must force layerID to type number', () => {
        action.layerID = '1';
        expect(layers(state, action).layers).toEqual([cloneTarget, {
          id: layerIdHandler.current(),
          title: cloneTarget.title + ' (copy)'
        }]);
      });

      it('must set the correct layerOperation', () => {
        state.layerOperation = null;
        expect(layers(state, action).layerOperation).toEqual({
          id: layerIdHandler.current(),
          type: LAYER_OPERATION_CLONE,
          targetID: cloneTarget.id
        });
      });
    });

    describe('LAYER_OPERATION_UNDO', () => {
      beforeEach(() => {
        action.type = LAYER_OPERATION_UNDO;
        state.history = [{},{},{
          layerID: 1,
          imageData: 'image data',
          position: 'position'
        }];
      });

      it('must set the right layer operation', () => {
        expect(layers(state, action).layerOperation).toEqual({
          id: 1,
          type: LAYER_OPERATION_UNDO,
          imageData: 'image data',
          position: 'position'
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
