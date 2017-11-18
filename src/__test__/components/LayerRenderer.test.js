import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LayerRenderer } from '../../components/LayerRenderer';

Enzyme.configure({ adapter: new Adapter() });

describe('<LayerRenderer />', () => {
	const layers = [
		{position: {left:-15, right:5 ,top:-15, bottom:-5}, isVisible: true},
		{position: {left:0, right:1 ,top:0, bottom:1}, isVisible: false},
		{position: {left:15, right:5 ,top:15, bottom:5}, isVisible: true},
	];
	const wrapper = shallow(<LayerRenderer />);
	const defaultState = wrapper.state();

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
		expect(defaultState).toEqual({
      isVisible: true,
      cWidth: 0,
      cHeight: 0,
      sWidth: 0,
      sHeight: 0,
			xMin: 0,
			yMin: 0
    });
  });

  describe('Lifecycle', () => {
		describe('function componentWillReceiveProps()', () => {
			describe('0 layers', () => {
				it('must trigger hideCanvas', () => {
					const hideCanvasStub = sinon.stub(wrapper.instance(), 'hideCanvas');
					wrapper.instance().componentWillReceiveProps({layers: { layers: []}});
					hideCanvasStub.restore();
					expect(hideCanvasStub.called).toBeTruthy();
				});
			});

			describe('> 0 layers', () => {
				const updateThrottleStub = sinon.stub(wrapper.instance(), 'updateThrottle');
				const showCanvasStub = sinon.stub(wrapper.instance(), 'showCanvas');
				wrapper.instance().componentWillReceiveProps({layers: { layers: layers}});
				updateThrottleStub.restore();
				showCanvasStub.restore();

				it('must trigger updateThrottle with args', () => {
					expect(updateThrottleStub.calledWith(layers)).toBeTruthy();
				});

				it('must trigger showCanvas', () => {
					expect(showCanvasStub.called).toBeTruthy();
				});
			});
		});
	});

	describe('functionality', () => {
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

		describe('function updateThrottle()', () => {
			it('must set state:updateTimeout', () => {
				wrapper.instance().updateThrottle([], false);
				expect(wrapper.state().updateTimeout).toBeTruthy();
			});

			it('must trigger calculateLayerPositions with args', () => {
				const calculateLayerPositionsStub = sinon.stub(wrapper.instance(), 'calculateLayerPositions');
				wrapper.state().updateTimeout = false;
				wrapper.instance().updateThrottle(layers, true);
				calculateLayerPositionsStub.restore();
				expect(calculateLayerPositionsStub.calledWith(layers)).toBeTruthy();
			});
		});

    describe('function calculateLayerPositions()', () => {
			const renderCollageStub = sinon.stub(wrapper.instance(), '_renderCollage');
			wrapper.instance().calculateLayerPositions(layers);
			const state = Object.assign({}, wrapper.state());
			renderCollageStub.restore();

			it('set state correctly', () => {
				expect(state).toMatchObject({
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
			const drawImageSpy = sinon.spy();
			const hideCanvasStub = sinon.stub(wrapper.instance(), 'hideCanvas');
			wrapper.instance().canvas = {
				getContext: () => ({
					clearRect: () => {},
					drawImage: drawImageSpy
				})
			};;
			wrapper.state().xMin = 1;
			wrapper.state().yMin = 2;
			const getElementByIdStub = sinon.stub(document, 'getElementById').returns('canvas');
			wrapper.instance()._renderCollage(layers);
			wrapper.instance()._renderCollage(layers.map(layer => Object.assign({}, layer, {isVisible: false})));
			hideCanvasStub.restore();
			getElementByIdStub.restore();

			it('must trigger drawImage forEach visible layer with args', () => {
				layers.forEach(layer => {
					if (!layer.isVisible) return;
					expect(drawImageSpy.calledWith(
						getElementByIdStub(),
						layer.position.left - 1,
						layer.position.top - 2,
						layer.width,
						layer.height
					)).toBeTruthy()
				});
			});

			it('must trigger drawImage 2 times (for each layer)', () => {
				expect(drawImageSpy.callCount).toBe(2);
			});

			it('must trigger hideCanvas on 0 visible layers', () => {
				expect(hideCanvasStub.called).toBeTruthy();
			});
		});

		describe('function showCollageImage()', () => {
			it('must trigger window.open with args', () => {
				wrapper.instance().canvas = {
					toDataURL: () => 'data url'
				};
				const windowOpenStub = sinon.stub(window, 'open');
				wrapper.instance().showCollageImage();
				windowOpenStub.restore();
				expect(windowOpenStub.calledWith('data url')).toBeTruthy();
			});
		});
	});
});
