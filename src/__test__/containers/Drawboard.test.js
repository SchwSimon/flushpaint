import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Drawboard } from '../../containers/Drawboard';

describe('<Drawboard />', () => {
	const wrapper = shallow(<Drawboard />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
