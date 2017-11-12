import { arrayMove } from 'react-sortable-hoc';
import { ADD_LAYER, SELECT_LAYER, TOGGLE_LAYER, SORT_LAYERORDER, LAYER_OPERATION_FILL,
 LAYER_OPERATION_CLEAR, REMOVE_LAYER, MERGE_LAYERS, SET_LAYERTITLE, SET_NEXTLAYERCONTENT,
 LAYER_OPERATION_COLORTOTRANSPARENT, LAYER_OPERATION_RESIZE, LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE,
 PUSH_HISTORY, LAYER_OPERATION_UNDO, LAYER_OPERATION_DONE, layerContentTypes, LAYER_OPERATION_CROP } from '../actions/index';
import layerIdHandler from './layers/layerIdHandler';
import generateLayerStructure, { LAYER_ID_PREFIX } from './layers/generateLayerStructure';

export const layersInitialState = {
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

const layers = (state = layersInitialState, action) => {
	switch(action.type) {
		case ADD_LAYER: {
			const layerID = layerIdHandler.next();
			return Object.assign({}, state, {
				selectedID: layerID,
				layers: state.layers.concat([
					generateLayerStructure(
						layerID,
            action.dimensions.width,
						action.dimensions.height
					)
				]),
        layerOperation: {
          id: layerID,
          type: LAYER_OPERATION_FILL,
          color: 'white'
        }
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

		case SORT_LAYERORDER:
			return Object.assign({}, state, {
        layers: arrayMove(state.layers, action.oldIndex, action.newIndex)
			});

    case LAYER_OPERATION_DONE:
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
        layers: /// set dimensions...
        layerOperation: {
          id: action.layerID,
          type: LAYER_OPERATION_CROP,
          cropData: action.cropData
        }
      });
    }
    break;

    case LAYER_OPERATION_UNDO:
      if (!state.history.length) break;
      const newState = Object.assign({}, state);
      const lastHistoryData = newState.history.pop();
      return Object.assign({}, state, {
        history: newState.history,
        layers: /// set dimensions...
        layerOperation: {
          id: lastHistoryData.layerID,
          type: LAYER_OPERATION_UNDO,
          imageData: lastHistoryData.data
        }
      });

    case LAYER_OPERATION_RESIZE:
      if (action.layerID) {
        action.layerID = action.layerID*1;
        return Object.assign({}, state, {
          layers: state.layers.map(layer => {
            if (layer.id === action.layerID)
              return Object.assign({}, layer, {
                width: action.dimensions.width,
                height: action.dimensions.height
              });
            return layer;
          })
        });
      }
			break;

		case SET_LAYERTITLE:
			return Object.assign({}, state, {
				layers: state.layers.map((layer, index) => {
					if (layer.id === action.layerID*1)
						layer.title = action.title;
					return layer;
				})
			});

		case SET_NEXTLAYERCONTENT: {
			if (!action.content) break;
			return Object.assign({}, state, {
				nextLayerContent: {
					type: action.content.type,
					data: action.content.data
				}
			});
		}



		case MERGE_LAYERS: {
			const layerSource = document.getElementById(LAYER_ID_PREFIX + action.sourceLayerID);
			const layerDest = document.getElementById(LAYER_ID_PREFIX + action.destLayerID);
			const sourceRect = layerSource.getBoundingClientRect();
			const destRect = layerDest.getBoundingClientRect();
			layerDest.getContext('2d').drawImage(
				layerSource,
				-(destRect.x - sourceRect.x),
				-(destRect.y - sourceRect.y)
			);
      break;
		}

		case PUSH_HISTORY: {
			if (!action.layerID) return state;
			const layer = document.getElementById(LAYER_ID_PREFIX + action.layerID);
			const nextData = state.history.concat({
				layerID: action.layerID,
				data: layer.getContext('2d').getImageData(
					0, 0,
					layer.width,
					layer.height
				)
			});
			if (state.history.length >= state.maxHistory)
				nextData.shift();
			return Object.assign({}, state, {
				history: nextData
			});
		}

		default: break;
	}

	return state;
}

export default layers;
