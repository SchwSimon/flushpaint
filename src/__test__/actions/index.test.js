import * as actions from '../../actions/index';

describe('Settings', () => {
  describe('constants', () => {
    it('SET_STROKESTYLE', () => {
      expect(actions.SET_STROKESTYLE).toBe('SET_STROKESTYLE');
    });

    it('SET_LINEWIDTH', () => {
      expect(actions.SET_LINEWIDTH).toBe('SET_LINEWIDTH');
    });

    it('SET_LINECAP', () => {
      expect(actions.SET_LINECAP).toBe('SET_LINECAP');
    });

    it('SET_GLOBALCOMPOSITEOPERATION', () => {
      expect(actions.SET_GLOBALCOMPOSITEOPERATION).toBe('SET_GLOBALCOMPOSITEOPERATION');
    });

    it('SET_TOOL', () => {
      expect(actions.SET_TOOL).toBe('SET_TOOL');
    });
  });

  describe('actions', () => {
    it('setStrokeStyle', () => {
  		const strokeStyle = 'strokeStyle';
  		expect(actions.setStrokeStyle(strokeStyle)).toEqual({
        type: actions.SET_STROKESTYLE,
        strokeStyle
      });
    });

    it('setLineWidth', () => {
  		const lineWidth = 'lineWidth';
  		expect(actions.setLineWidth(lineWidth)).toEqual({
        type: actions.SET_LINEWIDTH,
        lineWidth
      });
    });

    it('setLineCap', () => {
  		const lineCap = 'lineCap';
  		expect(actions.setLineCap(lineCap)).toEqual({
        type: actions.SET_LINECAP,
        lineCap
      });
    });

    it('setGlobalCompositeOperation', () => {
  		const globalCompositeOperation = 'globalCompositeOperation';
  		expect(actions.setGlobalCompositeOperation(globalCompositeOperation)).toEqual({
        type: actions.SET_GLOBALCOMPOSITEOPERATION,
        globalCompositeOperation
      });
    });

    it('setTool', () => {
  		const tool = 'tool';
  		expect(actions.setTool(tool)).toEqual({
        type: actions.SET_TOOL,
        tool
      });
    });
  });
});

describe('Layers', () => {
  describe('constants', () => {
  	it('INTERACTION_ENABLE_DRAWING', () => {
  		expect(actions.INTERACTION_ENABLE_DRAWING).toBe('INTERACTION_ENABLE_DRAWING');
    });

  	it('INTERACTION_ENABLE_MOVING', () => {
  		expect(actions.INTERACTION_ENABLE_MOVING).toBe('INTERACTION_ENABLE_MOVING');
    });

    it('INTERACTION_DISABLE', () => {
  		expect(actions.INTERACTION_DISABLE).toBe('INTERACTION_DISABLE');
    });

    it('ADD_LAYER', () => {
  		expect(actions.ADD_LAYER).toBe('ADD_LAYER');
    });

    it('REMOVE_LAYER', () => {
  		expect(actions.REMOVE_LAYER).toBe('REMOVE_LAYER');
    });

    it('SELECT_LAYER', () => {
  		expect(actions.SELECT_LAYER).toBe('SELECT_LAYER');
    });

    it('TOGGLE_LAYER', () => {
  		expect(actions.TOGGLE_LAYER).toBe('TOGGLE_LAYER');
    });

    it('SORT_LAYERS', () => {
  		expect(actions.SORT_LAYERS).toBe('SORT_LAYERS');
    });

    it('LAYER_PUSH_HISTORY', () => {
  		expect(actions.LAYER_PUSH_HISTORY).toBe('LAYER_PUSH_HISTORY');
    });

    it('LAYER_SET_TITLE', () => {
  		expect(actions.LAYER_SET_TITLE).toBe('LAYER_SET_TITLE');
    });

    it('LAYER_OPERATION_FILL', () => {
  		expect(actions.LAYER_OPERATION_FILL).toBe('LAYER_OPERATION_FILL');
    });

    it('LAYER_OPERATION_CLEAR', () => {
  		expect(actions.LAYER_OPERATION_CLEAR).toBe('LAYER_OPERATION_CLEAR');
    });

    it('LAYER_OPERATION_MERGE', () => {
  		expect(actions.LAYER_OPERATION_MERGE).toBe('LAYER_OPERATION_MERGE');
    });

    it('LAYER_OPERATION_COLORTOTRANSPARENT', () => {
  		expect(actions.LAYER_OPERATION_COLORTOTRANSPARENT).toBe('LAYER_OPERATION_COLORTOTRANSPARENT');
    });

    it('LAYER_OPERATION_RESIZE', () => {
  		expect(actions.LAYER_OPERATION_RESIZE).toBe('LAYER_OPERATION_RESIZE');
    });

    it('LAYER_OPERATION_CROP', () => {
  		expect(actions.LAYER_OPERATION_CROP).toBe('LAYER_OPERATION_CROP');
    });

    it('LAYER_OPERATION_IMAGEDATA', () => {
  		expect(actions.LAYER_OPERATION_IMAGEDATA).toBe('LAYER_OPERATION_IMAGEDATA');
    });

    it('LAYER_OPERATION_IMAGE', () => {
  		expect(actions.LAYER_OPERATION_IMAGE).toBe('LAYER_OPERATION_IMAGE');
    });

    it('LAYER_OPERATION_CLONE', () => {
  		expect(actions.LAYER_OPERATION_CLONE).toBe('LAYER_OPERATION_CLONE');
    });

    it('LAYER_OPERATION_UNDO', () => {
  		expect(actions.LAYER_OPERATION_UNDO).toBe('LAYER_OPERATION_UNDO');
    });

    it('LAYER_OPERATION_DONE', () => {
  		expect(actions.LAYER_OPERATION_DONE).toBe('LAYER_OPERATION_DONE');
    });
  });

  describe('actions', () => {
    it('enableDrawing', () => {
  		const layerID = 'layerID';
  		expect(actions.enableDrawing(layerID)).toEqual({
        type: actions.INTERACTION_ENABLE_DRAWING,
        layerID
      });
    });

    it('enableMoving', () => {
  		const layerID = 'layerID';
  		expect(actions.enableMoving(layerID)).toEqual({
        type: actions.INTERACTION_ENABLE_MOVING,
        layerID
      });
    });

    it('disableInteraction', () => {
  		expect(actions.disableInteraction()).toEqual({
        type: actions.INTERACTION_DISABLE
      });
    });

    it('addLayer', () => {
      const dimensions = 'dimensions';
      const layerOperation = 'layerOperation';
      expect(actions.addLayer(dimensions, layerOperation)).toEqual({
        type: actions.ADD_LAYER,
        dimensions,
        layerOperation
      });
    });

    it('cloneLayer', () => {
      const layerID = 'layerID';
      expect(actions.cloneLayer(layerID)).toEqual({
        type: actions.LAYER_OPERATION_CLONE,
        layerID
      });
    });

    it('selectLayer', () => {
      const layerID = 'layerID';
      expect(actions.selectLayer(layerID)).toEqual({
        type: actions.SELECT_LAYER,
        layerID
      });
    });

    it('toggleLayer', () => {
      const layerID = 'layerID';
      expect(actions.toggleLayer(layerID)).toEqual({
        type: actions.TOGGLE_LAYER,
        layerID
      });
    });

    it('sortLayers', () => {
      const oldIndex = 'oldIndex';
      const newIndex = 'newIndex';
      expect(actions.sortLayers(oldIndex, newIndex)).toEqual({
        type: actions.SORT_LAYERS,
        oldIndex,
      	newIndex
      });
    });

    it('fillLayer', () => {
      const layerID = 'layerID';
      const color = 'color';
      expect(actions.fillLayer(layerID, color)).toEqual({
        type: actions.LAYER_OPERATION_FILL,
        layerID,
        color
      });
    });

    it('clearLayer', () => {
      const layerID = 'layerID';
      expect(actions.clearLayer(layerID)).toEqual({
        type: actions.LAYER_OPERATION_CLEAR,
        layerID
      });
    });

    it('removeLayer', () => {
      const layerID = 'layerID';
      expect(actions.removeLayer(layerID)).toEqual({
        type: actions.REMOVE_LAYER,
        layerID
      });
    });

    it('mergeLayers', () => {
      const layerID = 'layerID';
      expect(actions.mergeLayers(layerID)).toEqual({
        type: actions.LAYER_OPERATION_MERGE,
        layerID
      });
    });

    it('setLayerTitle', () => {
      const layerID = 'layerID';
      const title = 'title';
      expect(actions.setLayerTitle(layerID, title)).toEqual({
        type: actions.LAYER_SET_TITLE,
        layerID,
        title
      });
    });

    it('setColorToTransparent', () => {
      const layerID = 'layerID';
      const color = 'color';
      expect(actions.setColorToTransparent(layerID, color)).toEqual({
        type: actions.LAYER_OPERATION_COLORTOTRANSPARENT,
        layerID,
        color
      });
    });

    it('resizeLayer', () => {
      const layerID = 'layerID';
      const dimensions = 'dimensions';
      expect(actions.resizeLayer(layerID, dimensions)).toEqual({
        type: actions.LAYER_OPERATION_RESIZE,
        layerID,
        dimensions
      });
    });

    it('putLayerImageData', () => {
      const layerID = 'layerID';
      const imageData = 'imageData';
      expect(actions.putLayerImageData(layerID, imageData)).toEqual({
        type: actions.LAYER_OPERATION_IMAGEDATA,
        layerID,
        imageData
      });
    });

    it('drawLayerImage', () => {
      const layerID = 'layerID';
      const image = 'image';
      expect(actions.drawLayerImage(layerID, image)).toEqual({
        type: actions.LAYER_OPERATION_IMAGE,
        layerID,
        image
      });
    });

    it('pushHistory', () => {
      const layerID = 'layerID';
      const imageData = 'imageData';
      const position = 'position';
      expect(actions.pushHistory(layerID, imageData, position)).toEqual({
        type: actions.LAYER_PUSH_HISTORY,
        layerID,
        imageData,
        position
      });
    });

    it('undoHistory', () => {
      expect(actions.undoHistory()).toEqual({
        type: actions.LAYER_OPERATION_UNDO
      });
    });

    it('layerOperationDone', () => {
      expect(actions.layerOperationDone()).toEqual({
        type: actions.LAYER_OPERATION_DONE
      });
    });
  });
});
