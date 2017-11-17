import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Crop } from '../../components/Tool-Crop';
import { cropLayer } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<Crop />', () => {
	const dispatchSpy = sinon.spy();
	const props = {
		layerHeight: 100,
		layerWidth: 200,
		dispatch: dispatchSpy,
		layerID: 1
	};
	const wrapper = shallow(<Crop {...props} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(wrapper.state()).toEqual({
			top: (props.layerHeight/2) - 40,
			left: (props.layerWidth/2) - 40,
			width: 80,
			height: 80
		});
  });

	describe('functionality', () => {
		const event = {
			clientX: 5,
			clientY: 6,
			stopPropagation: () => {}
		};

		describe('function onMouseMove()', () => {
			it('must trigger move with args', () => {
				const moveStub = sinon.stub(wrapper.instance(), 'move');
				wrapper.state().isMoving = true;
				wrapper.find('.Crop').simulate('mousemove', event);
				moveStub.restore();
				expect(moveStub.calledWith(event.clientX, event.clientY)).toBeTruthy();
			});

			it('must trigger move with args', () => {
				const resizeStub = sinon.stub(wrapper.instance(), 'resize');
				wrapper.state().isMoving = false;
				wrapper.state().isResizing = true;
				wrapper.find('.Crop').simulate('mousemove', event);
				resizeStub.restore();
				expect(resizeStub.calledWith(event.clientX, event.clientY)).toBeTruthy();
			});
		});

		describe('function enableMoving()', () => {
			it('must set the state correctly', () => {
				wrapper.find('.Crop-selection').simulate('mousedown', event);
				expect(wrapper.state()).toMatchObject({
					isMoving: true,
					isResizing: false,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
		});

		describe('function move()', () => {
			it('must set the state correctly', () => {
				wrapper.state().left = 1;
				wrapper.state().top = 2;
				wrapper.state().clientX = 3;
				wrapper.state().clientY = 4;
				wrapper.instance().move(5, 6);
				expect(wrapper.state()).toMatchObject({
					left: 1 - (3 - 5),
					top: 2 - (4 - 6),
					clientX: 5,
					clientY: 6
				});
			});
		});

		describe('function enableResize()', () => {
			it('must set the state correctly', () => {
				wrapper.find('.Crop-resize').simulate('mousedown', event);
				expect(wrapper.state()).toMatchObject({
					isResizing: true,
					isMoving: false,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
		});

		describe('function resize()', () => {
			it('must set the state correctly', () => {
				wrapper.instance().handler = {
					getBoundingClientRect: () => ({
						left: 3,
						top: 4,
						width: 5,
						height: 6
					})
				};
				wrapper.state().width = 1;
				wrapper.state().height = 2;
				wrapper.instance().resize(7, 8);
				expect(wrapper.state()).toMatchObject({
					width: 1 + 7 - 3 - (5/2),
					height: 2 + 8 - 4 - (6/2)
				});
			});
		});

		describe('function onCrop()', () => {
			it('must trigger dispatch with cropLayer', () => {
				wrapper.state().left = 1;
				wrapper.state().top = 2;
				wrapper.state().width = 3;
				wrapper.state().height = 4;
				wrapper.instance().onCrop();
				expect(dispatchSpy.calledWith(cropLayer(1, {
					left: 1,
					top: 2,
					width: 3,
					height: 4
				}))).toBeTruthy();
			});

			it('must set the state correctly', () => {
				wrapper.state().left = 22;
				wrapper.state().top = 22;
				wrapper.instance().onCrop();
				expect(wrapper.state()).toMatchObject({
					top: 0,
					left: 0
				});
			});
		});

		describe('function disableInteraction()', () => {
			it('must set the state correctly', () => {
				wrapper.instance().disableInteraction();
				expect(wrapper.state()).toMatchObject({
					isMoving: false,
					isResizing: false
				});
			});
		});
	});
});
