let LAYER_ID = 0;

const layerIdHandler = {
  current() {
    return LAYER_ID;
  },
  next() {
    return ++LAYER_ID;
  }
}

export default layerIdHandler
