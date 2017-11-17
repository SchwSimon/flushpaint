import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LineCap, LineCaps } from '../../components/Tool-LineCap';
import { setLineCap } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('LineCaps constant', () => {
	it('must match', () => {
		expect(LineCaps).toEqual({
			ROUND: 'round',
			SQUARE: 'square',
			BUTT: 'butt'
		});
	});
});

describe('<LineCap />', () => {
	const dispatchSpy = sinon.spy();
	const wrapper = shallow(<LineCap dispatch={dispatchSpy} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	describe('functionality', () => {
		describe('function onClick()', () => {
			it('must trigger dispatch with setGlobalCompositeOperation', () => {
				const value = LineCaps['BUTT'];
				wrapper.find('.LineCap-trigger').first().simulate('click', {target: {dataset: {cap: value}}});
				expect(dispatchSpy.calledWith(setLineCap(value))).toBeTruthy();
			});
		});
	});
});
