import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LineWidth } from '../../components/Tool-LineWidth';
import { setLineWidth } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<LineWidth />', () => {
	const dispatchSpy = sinon.spy();
	const wrapper = shallow(<LineWidth dispatch={dispatchSpy} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	describe('functionality', () => {
		describe('function onChange()', () => {
			it('must trigger dispatch with setGlobalCompositeOperation', () => {
				const value = 'value';
				wrapper.find('.LineWidth-input').simulate('change', {target: {value: value}});
				expect(dispatchSpy.calledWith(setLineWidth(value))).toBeTruthy();
			});
		});
	});
});
