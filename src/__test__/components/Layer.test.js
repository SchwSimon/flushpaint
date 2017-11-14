import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setStrokeStyle, selectLayer, enableMoving } from '../../actions/index';
import { ToolList } from '../../components/Tool';
Enzyme.configure({ adapter: new Adapter() });

import { Layer } from '../../components/Layer';

describe('<Layer />', () => {
  const props = (dispatch = () => {}) => ({
    dispatch: dispatch,
    width: 100,
    height: 100,
    settings: {
      tool: null
    },
    layerID: 1,
    layerIdPrefix: 'layer-'
  });
	const wrapper = shallow(<Layer {...props()} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
		expect(wrapper.state()).toEqual({
      showTextbox: false,
      top: 0,
      left: 0
    });
  });

  describe('functionality', () => {
    describe('function componentDidMount()', () => {
      afterAll(() => {
        document.getElementById.restore();
      })
      sinon.stub(document, 'getElementById').returns({
        clientHeight: 50,
        clientWidth: 50
      });
      const doLayerOperationSpy = sinon.spy(Layer.prototype, 'doLayerOperation');
      const wrapper = mount(<Layer {...props()} layerOperation={{id:1}} />);

      it('must call doLayerOperation with args', () => {
        expect(doLayerOperationSpy.calledWith({id:1})).toBeTruthy();
        doLayerOperationSpy.restore();
      });

      it('must set the state:top correct', () => {
        expect(wrapper.state().top).toBe(50/2 - props().height/2);
      });

      it('must set the state:left correct', () => {
        expect(wrapper.state().left).toBe(50/2 - props().width/2);
      });

      it('must diretly return if layerOperation undefined', () => {
        const doLayerOperationSpy = sinon.spy(Layer.prototype, 'doLayerOperation');
        const wrapper = shallow(<Layer {...props()} />);
        expect(doLayerOperationSpy.called).toBeFalsy();
        doLayerOperationSpy.restore();
      });

      it('must diretly return if layerOperation.id != prop.layerID', () => {
        const doLayerOperationSpy = sinon.spy(Layer.prototype, 'doLayerOperation');
        const wrapper = shallow(<Layer {...props()} layerOperation={{id:2}} />);
        expect(doLayerOperationSpy.called).toBeFalsy();
        doLayerOperationSpy.restore();
      });
    });

    describe('function onMouseDown()', () => {
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: 1,
        clientY: 1
      };

      it('must trigger function and set the correct state', () => {
        const wrapper = mount(<Layer {...props()} />);
        const getBoundingClientRect = sinon.stub(wrapper.instance().layer, 'getBoundingClientRect').returns({
          left: 5,
          top: 5
        });
        wrapper.find('canvas').simulate('mousedown', event);
        expect(wrapper.state()).toMatchObject({
          clientX: 1,
    			clientY: 1,
    			offsetLeft: 5,
    			offsetTop: 5
        });
        getBoundingClientRect.restore();
      });

      describe('settings.tool switch', () => {
        let spy;
        afterEach(() =>{
          spy.restore();
        });

        it('must trigger enableDrawing', () => {
          spy = sinon.stub(Layer.prototype, 'enableDrawing');
          const wrapper = mount(<Layer {...props()} settings={{tool: ToolList.BRUSH}}/>);
          wrapper.instance().onMouseDown(event);
          expect(spy.called).toBeTruthy();
        });

        it('must trigger enableDrawing', () => {
          spy = sinon.stub(Layer.prototype, 'enableDrawing');
          const wrapper = mount(<Layer {...props()} settings={{tool: ToolList.ERASER}}/>);
          wrapper.instance().onMouseDown(event);
          expect(spy.called).toBeTruthy();
        });

        it('must trigger enableMoving', () => {
          spy = sinon.stub(Layer.prototype, 'enableMoving');
          const wrapper = mount(<Layer {...props()} settings={{tool: ToolList.MOVE}}/>);
          wrapper.instance().onMouseDown(event);
          expect(spy.called).toBeTruthy();
        });

        it('must trigger absorbColor', () => {
          spy = sinon.stub(Layer.prototype, 'absorbColor');
          const wrapper = mount(<Layer {...props()} settings={{tool: ToolList.PIPETTE}}/>);
          wrapper.instance().onMouseDown(event);
          expect(spy.called).toBeTruthy();
        });

        it('must set the state correctly', () => {
          const wrapper = mount(<Layer {...props()} settings={{tool: ToolList.TEXT}}/>);
          const getBoundingClientRect = sinon.stub(wrapper.instance().layer, 'getBoundingClientRect').returns({
            left: 1,
            top: 1
          });
          sinon.stub(wrapper.instance(), 'render').returns(null);
          wrapper.instance().onMouseDown(event);
          expect(wrapper.state()).toMatchObject({
            showTextbox: true,
						toolClickX: 0,
						toolClickY: 0
          });
        });
      });
    });

    describe('function onMouseMove()', () => {
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: 10,
        clientY: 10
      };


      it('must trigger draw with client coordinates', () => {
        const wrapper = shallow(<Layer {...props()} interaction={{
          layerID: 1,
          draw: true
        }}/>);
        const draw = sinon.stub(wrapper.instance(), 'draw');
        wrapper.find('canvas').simulate('mousemove', event);
        expect(draw.calledWith(10, 10)).toBeTruthy();
      });

      it('must trigger move with client coordinates', () => {
        const wrapper = shallow(<Layer {...props()} interaction={{
          layerID: 1,
          move: true
        }}/>);
        const move = sinon.stub(wrapper.instance(), 'move');
        wrapper.instance().onMouseMove(event);
        expect(move.calledWith(10, 10)).toBeTruthy();
      });

      it('must not trigger move on interaction.id != layerID', () => {
        const wrapper = shallow(<Layer {...props()} interaction={{
          layerID: 2,
          move: true
        }}/>);
        const move = sinon.stub(wrapper.instance(), 'move');
        wrapper.instance().onMouseMove(event);
        expect(move.called).toBeFalsy();
      });

      it('must not trigger move on interaction undefined', () => {
        const wrapper = shallow(<Layer {...props()}/>);
        const move = sinon.stub(wrapper.instance(), 'move');
        wrapper.instance().onMouseMove(event);
        expect(move.called).toBeFalsy();
      });
    });

    describe('function enableMoving()', () => {
      it('must trigger dispatch with selectLayer', () => {
        const dispatchSpy = sinon.spy();
        const wrapper = shallow(<Layer {...props(dispatchSpy)}/>);
        wrapper.instance().enableMoving();
        expect(dispatchSpy.calledWith(selectLayer(props().layerID))).toBeTruthy();
      });

      it('must trigger dispatch with enableMoving', () => {
        const dispatchSpy = sinon.spy();
        const wrapper = shallow(<Layer {...props(dispatchSpy)}/>);
        wrapper.instance().enableMoving();
        expect(dispatchSpy.calledWith(enableMoving(props().layerID))).toBeTruthy();
      });
    });

    describe('function enableDrawing()', () => {
      beforeEach(() => {

      });

      it('must trigger pushHistory', () => {
        const wrapper = mount(<Layer {...props()}/>);
        const pushHistorySpy = sinon.spy(wrapper.instance(), 'pushHistory');
        wrapper.instance().enableDrawing();
        expect(pushHistorySpy.called).toBeTruthy();
      });

    });

    describe('function absorbColor()', () => {
      it('must trigger dispatch with setStrokeStyle', () => {
        const dispatchSpy = sinon.spy();
        const wrapper = mount(<Layer {...props(dispatchSpy)}/>);
        sinon.stub(wrapper.instance().layer, 'getContext').returns({
          getImageData: () => ({
            data: [1,2,3,4]
          })
        });
        wrapper.instance().absorbColor();
        expect(dispatchSpy.calledWith(setStrokeStyle(Array.from([1,2,3,4])))).toBeTruthy();
      });
    });
  });
});
