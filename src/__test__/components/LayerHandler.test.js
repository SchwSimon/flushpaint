import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { addLayer, drawLayerImage, fillLayer, clearLayer,
 removeLayer, setColorToTransparent, cloneLayer, mergeLayers,
 LAYER_OPERATION_IMAGE } from '../../actions/index';
import { LayerHandler, loadImageFromFile, onFileLoad } from '../../components/LayerHandler';

Enzyme.configure({ adapter: new Adapter() });

describe('function loadImageFromFile()', () => {
  const callbackSpy = sinon.spy();
  const readAsDataURLStub = sinon.stub(FileReader.prototype, 'readAsDataURL');
  sinon.stub(window, 'FileReader').returns({
    addEventListener: (a, onFileLoad, c) => {
      onFileLoad.call({
        removeEventListener: () => {},
        result: 'result'
      });
    },
    removeEventListener: () => {},
    readAsDataURL: readAsDataURLStub
  });

  const callbackArg = {
    removeEventListener: () => {},
    result: 'result'
  };
  sinon.stub(window, 'Image').returns({
    addEventListener: (a, onImageLoad, c) => {
      onImageLoad.call(callbackArg);
    },
    removeEventListener: () => {},
    readAsDataURL: readAsDataURLStub
  });

  loadImageFromFile('file', callbackSpy);

  it('must trigger readAsDataURL with arg', () => {
    expect(readAsDataURLStub.calledWith('file')).toBeTruthy();
  });

  it('must trigger the callback', () => {
    expect(callbackSpy.calledWith(callbackArg)).toBeTruthy();
  });
});


describe('<LayerHandler />', () => {
  const dispatchSpy = sinon.spy();
	const wrapper = shallow(<LayerHandler dispatch={dispatchSpy} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
		expect(wrapper.state()).toEqual({
      layerWidth: 600,
      layerHeight: 400
    });
  });

  describe('functionality', () => {
    describe('function addLayer()', () => {
      it('must trigger dispatch with addLayer', () => {
        wrapper.instance().addLayer();
    		expect(dispatchSpy.calledWith(addLayer({
          width: wrapper.state().layerWidth,
          height: wrapper.state().layerHeight
        }))).toBeTruthy();
      });
    });

    describe('function addImageLayerCallback()', () => {
      it('must trigger dispatch with addLayer', () => {
        const image = {
          width: 3,
          height: 4
        };
        const argOne = image;
        const argTwo = {
          type: LAYER_OPERATION_IMAGE,
          image: image,
          preventHistoryPush: true
        };
        wrapper.instance().addImageLayerCallback(image);

    		expect(dispatchSpy.calledWith(addLayer(argOne, argTwo))).toBeTruthy();
      });
    });

    describe('function insertImageCallback()', () => {
      it('must trigger dispatch with drawLayerImage', () => {
        const image = 'insertImageCallback';
        wrapper.instance().insertImageCallback(image);

    		expect(dispatchSpy.calledWith(drawLayerImage(wrapper.props().selectedLayerID, image))).toBeTruthy();
      });
    });

    describe('function fillLayer()', () => {
      it('must trigger dispatch with fillLayer', () => {
        wrapper.instance().fillLayer();
    		expect(dispatchSpy.calledWith(fillLayer(wrapper.props().selectedLayerID, wrapper.props().selectedColor))).toBeTruthy();
      });
    });

    describe('function clearLayer()', () => {
      it('must trigger dispatch with clearLayer', () => {
        wrapper.instance().clearLayer();
    		expect(dispatchSpy.calledWith(clearLayer(wrapper.props().selectedLayerID))).toBeTruthy();
      });
    });

    describe('function removeLayer()', () => {
      it('must trigger dispatch with removeLayer', () => {
        wrapper.instance().removeLayer();
    		expect(dispatchSpy.calledWith(removeLayer(wrapper.props().selectedLayerID))).toBeTruthy();
      });
    });

    describe('function colorToTransparent()', () => {
      it('must trigger dispatch with setColorToTransparent', () => {
        wrapper.instance().colorToTransparent();
    		expect(dispatchSpy.calledWith(setColorToTransparent(wrapper.props().selectedLayerID, wrapper.props().selectedColor))).toBeTruthy();
      });
    });

    describe('function clone()', () => {
      it('must trigger dispatch with cloneLayer', () => {
        wrapper.instance().clone();
    		expect(dispatchSpy.calledWith(cloneLayer(wrapper.props().selectedLayerID))).toBeTruthy();
      });
    });

    describe('function merge()', () => {
      it('must trigger dispatch with mergeLayers', () => {
        wrapper.instance().merge();
    		expect(dispatchSpy.calledWith(mergeLayers(wrapper.props().selectedLayerID))).toBeTruthy();
      });
    });

    describe('function onLayerWidthChange()', () => {
      it('must set the correct state', () => {
        wrapper.instance().onLayerWidthChange({target: {value: 99}});
    		expect(wrapper.state().layerWidth).toBe(99);
      });
    });

    describe('function onLayerHeightChange()', () => {
      it('must set the correct state', () => {
        wrapper.instance().onLayerHeightChange({target: {value: 66}});
    		expect(wrapper.state().layerHeight).toBe(66);
      });
    });
  });
});
