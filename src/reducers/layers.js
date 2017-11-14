import { ADD_LAYER, REMOVE_LAYER, SELECT_LAYER, TOGGLE_LAYER, SORT_LAYERS,
 LAYER_PUSH_HISTORY, LAYER_SET_TITLE, LAYER_OPERATION_FILL, LAYER_OPERATION_CLEAR,
 LAYER_OPERATION_MERGE, LAYER_OPERATION_COLORTOTRANSPARENT, LAYER_OPERATION_RESIZE,
 LAYER_OPERATION_CROP, LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE,
 LAYER_OPERATION_CLONE, LAYER_OPERATION_UNDO, LAYER_OPERATION_DONE,
 INTERACTION_ENABLE_DRAWING, INTERACTION_ENABLE_MOVING, INTERACTION_DISABLE } from '../actions/index';
import layerIdHandler from './layers/layerIdHandler';
import generateLayerStructure, { LAYER_ID_PREFIX } from './layers/generateLayerStructure';
import { arrayMove } from 'react-sortable-hoc';

export const layersInitialState = {
	selectedID: null,
	idPrefix: LAYER_ID_PREFIX,
  interaction: null,
	layers: [],
  layerOperation: null,
	history: [],
	maxHistory: 50
};

const layers = (state = layersInitialState, action) => {
	switch(action.type) {
    case INTERACTION_ENABLE_DRAWING:
      return Object.assign({}, state, {
				interaction: {
          layerID: action.layerID,
          draw: true
        }
      });

    case INTERACTION_ENABLE_MOVING:
      return Object.assign({}, state, {
				interaction: {
          layerID: action.layerID,
          move: true
        }
      });

    case INTERACTION_DISABLE:
      return Object.assign({}, state, {
        interaction: null
      });

		case ADD_LAYER: {
			const layerID = layerIdHandler.next();
      const layerOperation = action.layerOperation || {
        id: layerID,
        type: LAYER_OPERATION_FILL,
        color: 'white',
        preventHistoryPush: true
      };
      if (action.layerOperation)
        layerOperation.id = layerID;
			return Object.assign({}, state, {
				selectedID: layerID,
				layers: state.layers.concat([
					generateLayerStructure(
						layerID,
            action.dimensions.width,
						action.dimensions.height
					)
				]),
        layerOperation: layerOperation
			});
		}

    case REMOVE_LAYER: {
      action.layerID = action.layerID*1
			if (!action.layerID) break;
			return Object.assign({}, state, {
				selectedID: (state.selectedID === action.layerID) ? null : state.selectedID,
				layers: state.layers.filter(layer => layer.id !== action.layerID),
        history: state.history.filter(layer => layer.id !== action.layerID)
			});
		}

		case SELECT_LAYER:
			return Object.assign({}, state, {
				selectedID: action.layerID*1
			});

		case TOGGLE_LAYER: {
			action.layerID = action.layerID*1;
			return Object.assign({}, state, {
				layers: state.layers.map(layer => {
					if (layer.id === action.layerID)
						return Object.assign({}, layer, {
							isVisible: !layer.isVisible
						});
					return layer;
				})
			});
		}

		case SORT_LAYERS:
			return Object.assign({}, state, {
        layers: arrayMove(state.layers, action.oldIndex, action.newIndex)
			});

    case LAYER_PUSH_HISTORY: {
      if (!action.layerID) break;
      const history = Object.assign([], state.history);
      if (history.length >= state.maxHistory)
         history.shift();
      return Object.assign({}, state, {
        history: history.concat([{
          layerID: action.layerID*1,
          imageData: action.imageData,
          position: action.position
        }])
      });
    }

		case LAYER_SET_TITLE:
      action.layerID = action.layerID*1;
			return Object.assign({}, state, {
				layers: state.layers.map(layer => {
					if (layer.id === action.layerID)
            return Object.assign({}, layer, {
              title: action.title
            });
					return layer;
				})
			});

    case LAYER_OPERATION_DONE:
      if (state.layerOperation === null) break;
      return Object.assign({}, state, {
        layerOperation: null
      });

		case LAYER_OPERATION_FILL:
			if (action.layerID) {
        return Object.assign({}, state, {
          layerOperation: {
            id: action.layerID,
            type: LAYER_OPERATION_FILL,
            color: action.color
          }
  			});
      }
			break;

		case LAYER_OPERATION_CLEAR:
      if (action.layerID) {
        return Object.assign({}, state, {
          layerOperation: {
            id: action.layerID,
            type: LAYER_OPERATION_CLEAR
          }
        });
      }
      break;

		case LAYER_OPERATION_COLORTOTRANSPARENT:
			if (action.layerID) {
        return Object.assign({}, state, {
          layerOperation: {
            id: action.layerID,
            type: LAYER_OPERATION_COLORTOTRANSPARENT,
            color: action.color
          }
  			});
      }
			break;

    case LAYER_OPERATION_IMAGEDATA:
      if (action.layerID) {
        return Object.assign({}, state, {
          layerOperation: {
            id: action.layerID,
            type: LAYER_OPERATION_IMAGEDATA,
            imageData: action.imageData
          }
  			});
      }
			break;

    case LAYER_OPERATION_IMAGE:
      if (action.layerID) {
        return Object.assign({}, state, {
          layerOperation: {
            id: action.layerID,
            type: LAYER_OPERATION_IMAGE,
            image: action.image
          }
  			});
      }
			break;

    case LAYER_OPERATION_CROP:
      if (action.layerID) {
        return Object.assign({}, state, {
          layerOperation: {
            id: action.layerID,
            type: LAYER_OPERATION_CROP,
            cropData: action.cropData
          }
        });
      }
      break;

    case LAYER_OPERATION_RESIZE:
      if (action.layerID) {
        action.layerID = action.layerID*1;
        return Object.assign({}, state, {
          layers: Object.assign([], state.layers).map(layer => {
            if (layer.id === action.layerID)
              return Object.assign({}, layer, {
                width: action.dimensions.width,
                height: action.dimensions.height
              })
            return layer;
          })
        });
      }
			break;

    case LAYER_OPERATION_MERGE: {
      let layerIndex;
      action.layerID = action.layerID*1;
      state.layers.find((layer, index) => {
        if (layer.id === action.layerID) {
          layerIndex = index;
          return true;
        }
        return false;
      });
      const targetLayer = state.layers[layerIndex-1];
      if (targetLayer) {
        return Object.assign({}, state, {
          selectedID: targetLayer.id,
          layerOperation: {
            id: targetLayer.id,
            type: LAYER_OPERATION_MERGE,
            targetID: action.layerID
          }
  			});
      }
      break;
		}

    case LAYER_OPERATION_CLONE: {
      action.layerID = action.layerID*1;
      const cloneLayer = Object.assign({}, state.layers.find(layer => layer.id === action.layerID));
      cloneLayer.id = layerIdHandler.next();
      cloneLayer.title = cloneLayer.title + ' (copy)';
      return Object.assign({}, state, {
        selectedID: cloneLayer.id,
				layers: state.layers.concat([cloneLayer]),
        layerOperation: {
          id: cloneLayer.id,
          type: LAYER_OPERATION_CLONE,
          targetID: action.layerID
        }
			});
    }

    case LAYER_OPERATION_UNDO:
      if (!state.history.length) break;
      const newState = Object.assign({}, state);
      const lastHistoryData = newState.history.pop();
      return Object.assign({}, state, {
        history: newState.history,
        layerOperation: {
          id: lastHistoryData.layerID,
          type: LAYER_OPERATION_UNDO,
          imageData: lastHistoryData.imageData,
          position: lastHistoryData.position
        }
      });

		default: break;
	}

	return state;
}

export default layers;
