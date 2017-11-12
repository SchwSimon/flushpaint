import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Settings } from '../../containers/Settings';

describe('<Settings />', () => {
	const wrapper = shallow(<Settings />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
