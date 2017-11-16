import generateLayerStructure, { LAYER_ID_PREFIX } from '../../../reducers/layers/generateLayerStructure';

describe('LAYER_ID_PREFIX', () => {
  it('must be "Layer-"', () => {
    expect(LAYER_ID_PREFIX).toBe('Layer-');
  });
});

describe('function generateLayerStructure()', () => {
  const structure = {
    id: 1,
    isVisible: true,
    width: 600,
    height: 400,
    title: LAYER_ID_PREFIX + 1,
    position: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  };

	it('must return a correct layer structure', () => {
		expect(generateLayerStructure(1, 600, 400)).toEqual(structure);
  });

  it('must force id to number', () => {
		expect(generateLayerStructure('1', 600, 400)).toEqual(structure);
  });

  it('must force width to number', () => {
		expect(generateLayerStructure(1, '600', 400)).toEqual(structure);
  });

  it('must force height to number', () => {
		expect(generateLayerStructure(1, 600,'400')).toEqual(structure);
  });
});
