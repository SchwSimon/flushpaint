import React from 'react';
import Enzyme, { mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { addLayer } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

import { Drawboard } from '../../containers/Drawboard';

describe('<Drawboard />', () => {
	const dispatch = sinon.spy();
	const wrapper = mount(<Drawboard dispatch={dispatch} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	describe('function componentDidMount()', () => {
		it('must set state correct', () => {
			expect(wrapper.state()).toEqual({
				clientWidth: wrapper.instance().drawboard.clientWidth,
				clientHeight: wrapper.instance().drawboard.clientHeight
			});
		});

		it('must trigger dispatch with the given callback', () => {
			const addLayerArgs = {
				width: 600,
				height: 400
			};
			expect(dispatch.calledWith(addLayer(addLayerArgs))).toBeTruthy();
		});
	});
});
