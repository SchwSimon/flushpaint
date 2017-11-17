import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GlobalCompositeOperation, GlobalCompositeOperations } from '../../components/Tool-GlobalCompositeOperation';
import { setGlobalCompositeOperation } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('GlobalCompositeOperations constant', () => {
	it('must match', () => {
		expect(GlobalCompositeOperations).toEqual({
			SOURCE_OVER: 'source-over',
			SOURCE_IN: 'source-in',
			SOURCE_OUT: 'source-out',
			SOURCE_ATOP: 'source-atop',
			DESTINATION_OVER: 'destination-over',
			DESTINATION_IN: 'destination-in',
			DESTINATION_OUT: 'destination-out',
			DESTINATION_ATOP: 'destination-atop',
			LIGHTER: 'lighter',
			COPY: 'copy',
			XOR: 'xor',
			MULTIPLY: 'multiply',
			SCREEN: 'screen',
			OVERLAY: 'overlay',
			DARKEN: 'darken',
			LIGHTEN: 'lighten',
			COLOR_DODGE: 'color-dodge',
			COLOR_BURN: 'color-burn',
			HARD_LIGHT: 'hard-light',
			SOFT_LIGHT: 'soft-light',
			DIFFERENCE: 'difference',
			EXCLUSION: 'exclusion',
			HUE: 'hue',
			SATURATION: 'saturation',
			COLOR: 'color',
			LUMINOSITY: 'luminosity'
		});
	});
});

describe('<GlobalCompositeOperation />', () => {
	const dispatchSpy = sinon.spy();
	const wrapper = shallow(<GlobalCompositeOperation dispatch={dispatchSpy} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	describe('functionality', () => {
		describe('function onChange()', () => {
			it('must trigger dispatch with setGlobalCompositeOperation', () => {
				const value = GlobalCompositeOperations['SATURATION'];
				wrapper.find('.GlobalCompositeOperation').simulate('change', {target: {value: value}});
				expect(dispatchSpy.calledWith(setGlobalCompositeOperation(value))).toBeTruthy();
			});
		});
	});
});
