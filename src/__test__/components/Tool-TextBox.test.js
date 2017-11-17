import React from 'react';
import sinon from 'sinon';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TextBox } from '../../components/Tool-TextBox';

Enzyme.configure({ adapter: new Adapter() });

describe('<TextBox />', () => {
	const wrapper = mount(<TextBox />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(wrapper.state()).toEqual({
			showColorPicker: false,
			textSize: 14,
			textColor: 'black',
			tempTextColor: 'black'
		});
  });

	describe('functionality', () => {
		describe('function onFontSizeChange()', () => {
			it('must set state:onFontSizeChange correctly', () => {
				wrapper.find('.TextBox-fontsize').simulate('change', {target: {value: 33}});
				expect(wrapper.state().textSize).toBe(33);
			});
		});

		describe('function onColorClick()', () => {
			it('must set state:showColorPicker correctly', () => {
				wrapper.find('.TextBox-fontcolor').simulate('click');
				expect(wrapper.state().showColorPicker).toBe(true);
			});
		});

		describe('function onColorChange()', () => {
			it('must set state:tempTextColor correctly', () => {
				wrapper.instance().onColorChange({hex: 'hexColor'});
				expect(wrapper.state().tempTextColor).toEqual('hexColor');
			});
		});

		describe('function onColorCancel()', () => {
			it('must set state:showColorPicker correctly', () => {
				wrapper.instance().onColorCancel();
				expect(wrapper.state().showColorPicker).toBe(false);
			});
		});

		describe('function onColorSubmit()', () => {
			const onColorCancelSpy = sinon.stub(wrapper.instance(), 'onColorCancel')
			wrapper.instance().onColorSubmit();
			onColorCancelSpy.restore();

			it('must set state:textColor correctly', () => {
				expect(wrapper.state().textColor).toBe(wrapper.state().textColor);
			});

			it('must trigger onColorCancel', () => {
				expect(onColorCancelSpy.called).toBeTruthy();
			});
		});

		describe('function onPrint()', () => {
			const hideTextboxSpy = sinon.spy();
			const onTextPrintSpy = sinon.spy();
			const wrapper = mount(<TextBox
				hideTextbox={hideTextboxSpy}
				onTextPrint={onTextPrintSpy}
				posX={2}
				posY={3}
			/>);
			wrapper.instance().textInput.value = 'a a\nb b\nc c';
			wrapper.find('.TextBox-submit').simulate('click');

			it('must trigger hideTextbox', () => {
				expect(hideTextboxSpy.called).toBeTruthy();
			});

			it('must trigger onTextPrintSpy 3 times', () => {
				expect(onTextPrintSpy.callCount).toBe(3);
			});

			it('must trigger onTextPrintSpy 3 times', () => {
				const textSplit = ['a a', 'b b', 'c c'];
				for(let i = 0; i < 3; i++) {
					expect(onTextPrintSpy.calledWith(textSplit[i], {
						x: wrapper.props().posX - 2,
						y: (wrapper.props().posY + wrapper.state().textSize - 6) + (i* wrapper.state().textSize) - 1,
						color: wrapper.state().textColor,
						size: wrapper.state().textSize
					})).toBeTruthy();
				}
			});
		});

	});
});
