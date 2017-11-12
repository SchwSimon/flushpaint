import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Header } from '../../containers/Header';

describe('<Header />', () => {
	const wrapper = shallow(<Header />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
