import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setTool } from '../../actions/index';
import { Tool, ToolList, ToolNames } from '../../components/Tool';

Enzyme.configure({ adapter: new Adapter() });

describe('ToolList constant', () => {
	it('must equal', () => {
		expect(ToolList).toEqual({
			BRUSH: 'BRUSH',
			ERASER: 'ERASER',
			PIPETTE: 'PIPETTE',
			CROP: 'CROP',
			MOVE: 'MOVE',
			TEXT: 'TEXT'
		});
	});
});

describe('ToolNames constant', () => {
	it('must equal', () => {
		expect(ToolNames).toEqual({
			BRUSH: 'Paint',
			ERASER: 'Erase',
			PIPETTE: 'Color pipette',
			CROP: 'Crop',
			MOVE: 'Select / Move',
			TEXT: 'Text'
		});
	});
});

describe('<Tool />', () => {
	const wrapper = shallow(<Tool />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('must trigger dispatch with setTool', () => {
		const dispatchSpy = sinon.spy();
		const wrapper = shallow(<Tool dispatch={dispatchSpy} tool={ToolList.TEXT} />);
		wrapper.find('.Tool').simulate('click');
		expect(dispatchSpy.calledWith(setTool(ToolList.TEXT))).toBeTruthy();
  });
});
