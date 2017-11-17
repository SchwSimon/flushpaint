import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { History } from '../../components/Tool-History';
import { undoHistory } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<History />', () => {
	const dispatchSpy = sinon.spy();
	const wrapper = shallow(<History dispatch={dispatchSpy} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	describe('functionality', () => {
		describe('function onClick()', () => {
			it('must trigger dispatch with setGlobalCompositeOperation', () => {
				wrapper.find('.History').simulate('click');
				expect(dispatchSpy.calledWith(undoHistory())).toBeTruthy();
			});
		});
	});
});
