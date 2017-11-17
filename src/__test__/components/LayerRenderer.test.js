import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LayerRenderer } from '../../components/LayerRenderer';

Enzyme.configure({ adapter: new Adapter() });

describe('<LayerRenderer />', () => {
	const wrapper = shallow(<LayerRenderer />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
		expect(wrapper.state()).toEqual({
      isVisible: true,
      cWidth: 0,
      cHeight: 0,
      sWidth: 0,
      sHeight: 0,
			xMin: 0,
			yMin: 0
    });
  });

  describe('lifecycle', () => {
		const layers = [
			{position: {left:-15, right:5 ,top:-15, bottom:-5}, isVisible: true},
			{position: {left:0, right:1 ,top:0, bottom:1}, isVisible: false},
			{position: {left:15, right:5 ,top:15, bottom:5}, isVisible: true},
		];
		const canvas = {
			getBoundingClientRect: () => ({
				left: 1,
				right: 2,
				top: 3,
				bottom: 4
			}),
			width: 55,
			height: 66
		};
		sinon.stub(document, 'getElementById').returns(canvas);

		describe('function componentWillReceiveProps()', () => {
			describe('with 0 layers', () => {
				it('must trigger hideCanvas', () => {
					const wrapper = shallow(<LayerRenderer />);
					const hideCanvasSpy = sinon.spy(wrapper.instance(), 'hideCanvas');
					wrapper.instance().componentWillReceiveProps({layers: { layers: []}});
					expect(hideCanvasSpy.called).toBeTruthy();
				});
			});

			describe('with more than 0 layers', () => {
				const wrapper = shallow(<LayerRenderer />);
				const updateThrottleStub = sinon.stub(wrapper.instance(), 'updateThrottle');
				const showCanvasSpy = sinon.spy(wrapper.instance(), 'showCanvas');
				wrapper.instance().componentWillReceiveProps({layers: { layers: layers}});

				it('must trigger updateThrottle with args', () => {
					expect(updateThrottleStub.calledWith(layers)).toBeTruthy();
				});

				it('must trigger showCanvas', () => {
					expect(showCanvasSpy.called).toBeTruthy();
				});
			});
		});

		describe('canvas visibility', () => {
			const wrapper = shallow(<LayerRenderer />);

			describe('function hideCanvas()', () => {
				it('must set state:isVisible to false', () => {
					wrapper.instance().hideCanvas();
					expect(wrapper.state().isVisible).toBe(false);
				});
			});

			describe('function showCanvas()', () => {
				it('must set state:isVisible to true', () => {
					wrapper.instance().showCanvas();
					expect(wrapper.state().isVisible).toBe(true);
				});
			});
		});

		describe('function updateThrottle()', () => {
			it('must set state:updateTimeout', () => {
				const wrapper = shallow(<LayerRenderer />);
				wrapper.instance().updateThrottle([], false);
				expect(wrapper.state().updateTimeout).toBeTruthy();
			});

			it('must trigger calculateLayerPositions with args', () => {
				const wrapper = shallow(<LayerRenderer />);
				const calculateLayerPositionsStub = sinon.stub(wrapper.instance(), 'calculateLayerPositions');
				wrapper.instance().updateThrottle([1,2], true);
				expect(calculateLayerPositionsStub.calledWith([1,2])).toBeTruthy();
			});
		});

    describe('function calculateLayerPositions()', () => {
			const wrapper = shallow(<LayerRenderer />);
			const renderCollageStub = sinon.stub(wrapper.instance(), '_renderCollage');

			wrapper.instance().calculateLayerPositions(layers);

			it('set state correctly', () => {
				expect(wrapper.state()).toEqual({
					isVisible: true,
					cWidth: 20,
					cHeight: 20,
					sWidth: 20,
					sHeight: 20,
					xMin: -15,
					yMin: -15
				});
      });

			it('set trigger _renderCollage with args', () => {
				expect(renderCollageStub.calledWith(layers)).toBeTruthy();
      });
    });

		describe('function _renderCollage()', () => {
				////// MOUNT weg
			const wrapper = mount(<LayerRenderer />);
			const drawImageSpy = sinon.spy();
			const hideCanvasSpy = sinon.spy(wrapper.instance(), 'hideCanvas');
			sinon.stub(wrapper.instance().canvas, 'getContext').returns({
				clearRect: () => {},
				drawImage: drawImageSpy
			});

			wrapper.instance()._renderCollage(layers);

			it('must trigger drawImage forEach layer with args', () => {
				layers.forEach(layer => {
					if (!layer.isVisible) return;
					expect(drawImageSpy.calledWith(
						canvas,
						layer.position.left - wrapper.state().xMin,
						layer.position.top - wrapper.state().yMin,
						layer.width,
						layer.height
					)).toBeTruthy()
				});
			});

			it('must trigger drawImage 2 times (for each layer)', () => {
				expect(drawImageSpy.callCount).toBe(2);
			});

			it('must trigger hideCanvas on 0 visible layers', () => {
				const notVisibleLayers = layers.map(layer => Object.assign({}, layer, {isVisible: false}));
				wrapper.instance()._renderCollage(notVisibleLayers);
				expect(hideCanvasSpy.called).toBeTruthy();
			});
		});

		describe('function showCollageImage()', () => {
			it('must trigger window.open with args', () => {
				const wrapper = mount(<LayerRenderer />);
				const windowOpenSpy = sinon.spy(window, 'open');
				sinon.stub(wrapper.instance().canvas, 'toDataURL').returns('dataUrl');
				wrapper.instance().showCollageImage();
				expect(windowOpenSpy.calledWith('dataUrl')).toBeTruthy();
			});
		});
  });
});
