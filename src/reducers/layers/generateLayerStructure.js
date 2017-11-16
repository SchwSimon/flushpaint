export const LAYER_ID_PREFIX = 'Layer-';

const generateLayerStructure = (id, width, height) => ({
  id: id*1,
	isVisible: true,
	width: width*1,
	height: height*1,
	title: LAYER_ID_PREFIX + id,
  position: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

export default generateLayerStructure;
