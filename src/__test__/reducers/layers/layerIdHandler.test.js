import layerIdHandler from '../../../reducers/layers/layerIdHandler';

describe('function layerIdHandler()', () => {
  it('initial id', () => {
    expect(layerIdHandler.current()).toBe(0);
  });

  it('increment id and return', () => {
    expect(layerIdHandler.next()).toBe(1);
    expect(layerIdHandler.next()).toBe(2);
    expect(layerIdHandler.next()).toBe(3);
  });

  it('new current id', () => {
    expect(layerIdHandler.current()).toBe(3);
  });
});
