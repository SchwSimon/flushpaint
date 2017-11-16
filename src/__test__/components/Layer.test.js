import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setStrokeStyle, selectLayer, enableMoving, enableDrawing, disableInteraction,
 pushHistory, updatePosition, layerOperationDone, resizeLayer, removeLayer,
 LAYER_OPERATION_FILL, LAYER_OPERATION_CLEAR, LAYER_OPERATION_COLORTOTRANSPARENT,
 LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE, LAYER_OPERATION_CROP,
 LAYER_OPERATION_CLONE, LAYER_OPERATION_MERGE, LAYER_OPERATION_UNDO } from '../../actions/index';
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
    layerIdPrefix: 'layer-',
    clientRect: {
      left: 11,
      right: 22,
      top: 33,
      bottom: 44
    }
  });
  const getBoundingClientRectReturn = {left: 3, top: 4};
  const getElementByIdReturn = {
    clientHeight: 50,
    clientWidth: 50,
    getContext: () => ({
      getImageData: () => 'getImageData'
    }),
    getBoundingClientRect: () => getBoundingClientRectReturn
  };
  const getElementByIdStub = sinon.stub(document, 'getElementById').returns(getElementByIdReturn);
  let onPositionUpdateStub = sinon.stub(Layer.prototype, 'onPositionUpdate');
	const wrapper = shallow(<Layer {...props()} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
		expect(wrapper.state()).toEqual({
      showTextbox: false,
      top: getElementByIdStub().clientHeight/2 - props().height/2,
      left: getElementByIdStub().clientWidth/2 - props().width/2
    });
  });

  it('must have called onPositionUpdate', () => {
    expect(onPositionUpdateStub.called).toBeTruthy();
  });

  describe('functionality', () => {
    describe('function onPositionUpdate()', () => {
      onPositionUpdateStub.restore();

      it('must set state:positionUpdateTimeout', () => {
        const wrapper = shallow(<Layer {...props()}/>);
        wrapper.instance().onPositionUpdate(false);
        expect(wrapper.state().positionUpdateTimeout).toBeTruthy();
      });

      it('must trigger dispatch with updatePosition', () => {
        const dispatchSpy = sinon.spy();
        const wrapper = mount(<Layer {...props(dispatchSpy)}/>);
        const getBoundingClientRectStub = sinon.stub(wrapper.instance().layer, 'getBoundingClientRect')
          .returns({
            left: 1,
            right: 2,
            top: 3,
            bottom: 4
          });
        wrapper.state().positionUpdateTimeout = null;
        wrapper.instance().onPositionUpdate(true);

        expect(dispatchSpy.calledWith(updatePosition(props().layerID, {
          left: 1,
          right: 2,
          top: 3,
          bottom: 4
        }))).toBeTruthy();
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
        wrapper.find('canvas').simulate('mousedown', event);
        expect(wrapper.state()).toMatchObject({
          clientX: event.clientX,
    			clientY: event.clientY,
    			offsetLeft: props().clientRect.left,
    			offsetTop: props().clientRect.top
        });
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
          sinon.stub(wrapper.instance(), 'render').returns(null);
          wrapper.instance().onMouseDown(event);
          expect(wrapper.state()).toMatchObject({
            showTextbox: true,
						toolClickX: event.clientX - props().clientRect.left,
						toolClickY: event.clientY - props().clientRect.top
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
      const dispatchSpy = sinon.spy();
      const wrapper = shallow(<Layer {...props(dispatchSpy)}/>);
      wrapper.instance().enableMoving();

      it('must trigger dispatch with selectLayer', () => {
        expect(dispatchSpy.calledWith(selectLayer(props().layerID))).toBeTruthy();
      });

      it('must trigger dispatch with enableMoving', () => {
        expect(dispatchSpy.calledWith(enableMoving(props().layerID))).toBeTruthy();
      });
    });

    describe('function enableDrawing()', () => {
      const settings = {
        lineCap: 'line cap',
        lineWidth: 'line width',
        strokeStyle: 'stroke style',
        globalCompositeOperation: 'gco'
      };
      const dispatchSpy = sinon.spy();
      const wrapper = mount(<Layer {...props(dispatchSpy)} settings={settings}/>);
      const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
      const drawStub = sinon.stub(wrapper.instance(), 'draw');
      sinon.stub(wrapper.instance().layer, 'getContext').returns({
        lineCap: null,
        lineWidth: null,
        strokeStyle: null,
        globalCompositeOperation: null
      });
      wrapper.instance().enableDrawing();

      it('must trigger pushHistory', () => {
        expect(pushHistoryStub.called).toBeTruthy();
      });

      it('must trigger dispatch with enableDrawing', () => {
        expect(dispatchSpy.calledWith(enableDrawing(props().layerID))).toBeTruthy();
      });

      it('must trigger draw()', () => {
        expect(drawStub.called).toBeTruthy();
      });
    });

    describe('function disableInteraction()', () => {
      it('must trigger dispatch with disableInteraction', () => {
        const dispatchSpy = sinon.spy();
        const wrapper = shallow(<Layer {...props(dispatchSpy)}/>);
        wrapper.find('canvas').simulate('mouseup');
        //wrapper.instance().disableInteraction();
        expect(dispatchSpy.calledWith(disableInteraction())).toBeTruthy();
      });
    });

    describe('function move()', () => {
      it('must set the correct state', () => {
        const wrapper = shallow(<Layer {...props()}/>);
        const prevState = wrapper.state();
        wrapper.instance().move(6, 7);
        expect(wrapper.state()).toMatchObject({
          left: prevState.left + (6 - prevState.clientX),
          top: prevState.top + (7 - prevState.clientY),
          clientX: 6,
    			clientY: 7
        });
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

    describe('function onTextPrint()', () => {
      const fillTextSpy = sinon.spy();
      const wrapper = mount(<Layer {...props()}/>);
      const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
      sinon.stub(wrapper.instance().layer, 'getContext').returns({
        font: null,
        fillStyle: null,
        fillText: fillTextSpy
      });
      wrapper.instance().onTextPrint('text', {
        size: 11, color: 'color',
        x: 3, y: 4
      });

      it('must trigger pushHistory', () => {
        expect(pushHistoryStub.called).toBeTruthy();
      });

      it('must trigger fillText with args', () => {
        expect(fillTextSpy.calledWith('text', 3, 4)).toBeTruthy();
      });
    });

    describe('function pushHistory()', () => {
      const dispatchSpy = sinon.spy();
      const wrapper = mount(<Layer {...props(dispatchSpy)}/>);
      sinon.stub(wrapper.instance().layer, 'getContext').returns({
        getImageData: () => 'image data'
      });
      wrapper.instance().pushHistory();

      it('must trigger dispatch with pushHistory', () => {
        expect(dispatchSpy.calledWith(pushHistory(
          props().layerID,
          'image data',
          null
        ))).toBeTruthy();
      });

      it('must trigger dispatch with pushHistory (withPosition = true)', () => {
        wrapper.instance().pushHistory(true);
        expect(dispatchSpy.calledWith(pushHistory(
          props().layerID,
          'image data',
          { left: wrapper.state().left,
            top: wrapper.state().top  }
        ))).toBeTruthy();
      });
    });

    describe('function doLayerOperation()', () => {
      const dispatchSpy = sinon.spy();
      const wrapper = mount(<Layer {...props(dispatchSpy)}/>);
      const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
      const fillSpy = sinon.spy();
      const putImageDataSpy = sinon.spy();
      const drawImageSpy = sinon.spy();
      const doLayerOperationSpy = sinon.spy(wrapper.instance(), 'doLayerOperation');
      sinon.stub(wrapper.instance().layer, 'getContext').returns({
        rect: () => {},
        fill: fillSpy,
        getImageData: () => ({
          data: [30,30,60,1]
        }),
        putImageData: putImageDataSpy,
        drawImage: drawImageSpy
      });
      wrapper.instance().doLayerOperation({});

      it('must trigger dispatch with layerOperationDone', () => {
        expect(dispatchSpy.calledWith(layerOperationDone())).toBeTruthy();
      });

      describe('switch(operation.type)', () => {
        let historyPushCallCount = 0;
        let fillCallCount = 0;

        describe('LAYER_OPERATION_FILL', () => {
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_FILL
          });
          historyPushCallCount++;
          fillCallCount++;

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.callCount).toBe(historyPushCallCount);
          });

          it('must trigger fill', () => {
            expect(fillSpy.called).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_CLEAR', () => {
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_CLEAR
          });
          historyPushCallCount++;
          fillCallCount++;

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.callCount).toBe(historyPushCallCount);
          });

          it('must trigger fill', () => {
            expect(fillSpy.callCount).toBe(fillCallCount);
          });
        });

        describe('LAYER_OPERATION_COLORTOTRANSPARENT', () => {
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_COLORTOTRANSPARENT,
            color: 'rgba(30,30,30,1)'
          });
          historyPushCallCount++;

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.callCount).toBe(historyPushCallCount);
          });

          it('must trigger putImageData with args', () => {
            expect(putImageDataSpy.calledWith({data: [30,30,60,0]}, 0, 0)).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_IMAGEDATA', () => {
          const imageData = {
            width: wrapper.instance().layer.width,
            height: wrapper.instance().layer.height,
            test: LAYER_OPERATION_IMAGEDATA
          };
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_IMAGEDATA,
            imageData: imageData
          });
          historyPushCallCount++;

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.callCount).toBe(historyPushCallCount);
          });

          it('must trigger putImageData with args', () => {
            expect(putImageDataSpy.calledWith(imageData, 0, 0)).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_IMAGE', () => {
          const operation = {
            type: LAYER_OPERATION_IMAGE,
            image: {
              width: 10,
              height: 20,
              test: LAYER_OPERATION_IMAGE
            }
          };
          wrapper.instance().doLayerOperation(operation);
          historyPushCallCount++;

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.callCount).toBe(historyPushCallCount);
          });

          it('must trigger drawImage with args (opts undefined)', () => {
            expect(drawImageSpy.calledWith(
              operation.image,
              (wrapper.instance().layer.width/2) - (operation.image.width/2),
              (wrapper.instance().layer.height/2) - (operation.image.height/2),
              operation.image.width,
              operation.image.height
            )).toBeTruthy();
          });

          it('must trigger drawImage with args (opts defined)', () => {
            operation.opts = [1,2,3,4]
            wrapper.instance().doLayerOperation(operation);
            historyPushCallCount++;
            expect(drawImageSpy.calledWith(operation.image, 1, 2, 3 ,4)).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_CROP', () => {
          const operation = {
            type: LAYER_OPERATION_CROP,
            cropData: {
              left: 13,
              top: 24,
              width: 130,
              height: 240
            }
          };

          it('must trigger pushHistory (with arg: true)', () => {
            wrapper.instance().doLayerOperation(operation);
            historyPushCallCount++;
            expect(pushHistoryStub.callCount).toBe(historyPushCallCount);
            expect(pushHistoryStub.calledWith(true)).toBeTruthy();
          });

          it('must set the state correctly', () => {
            wrapper.state().left = 0;
            wrapper.state().top = 0;
            wrapper.instance().doLayerOperation(operation);
            historyPushCallCount++;
            expect(wrapper.state()).toMatchObject({
              left: operation.cropData.left,
              top: operation.cropData.top,
            });
          });

          it('must trigger dispatch with resizeLayer', () => {
            expect(dispatchSpy.calledWith(resizeLayer(props().layerID, {
              width: operation.cropData.width,
              height: operation.cropData.height
            }))).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_CLONE', () => {
          const operation = {
            type: LAYER_OPERATION_CLONE,
          };
          wrapper.instance().doLayerOperation(operation);

          it('must trigger doLayerOperation with args', () => {
            expect(doLayerOperationSpy.calledWith({
              type: LAYER_OPERATION_IMAGEDATA,
              imageData: 'getImageData',
              preventHistoryPush: true
            })).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_MERGE', () => {
          const operation = {
            type: LAYER_OPERATION_MERGE,
            targetID: 9
          };
          wrapper.instance().doLayerOperation(operation);
          historyPushCallCount++;

          it('must trigger doLayerOperation with args', () => {
            expect(doLayerOperationSpy.calledWith({
              type: LAYER_OPERATION_IMAGE,
              image: getElementByIdReturn,
              opts: [
                -(wrapper.props().clientRect.left - getBoundingClientRectReturn.left),
                -(wrapper.props().clientRect.top - getBoundingClientRectReturn.top)
              ]
            })).toBeTruthy();
          });

          it('must trigger dispatch with removeLayer', () => {
            expect(dispatchSpy.calledWith(removeLayer(operation.targetID))).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_UNDO', () => {
          const operation = {
            type: LAYER_OPERATION_UNDO,
            position: {
              left: 8,
              top: 9
            },
            imageData: {
              width: 88,
              height: 99
            }
          };

          it('must set the state correctly', () => {
            wrapper.instance().doLayerOperation(operation);
            historyPushCallCount++;
            expect(wrapper.state()).toMatchObject(operation.position);
          });

          it('must trigger dispatch with resizeLayer', () => {
            expect(dispatchSpy.calledWith(resizeLayer(props().layerID, {
              width: operation.imageData.width,
              height: operation.imageData.height
            }))).toBeTruthy();
          });

          it('must trigger doLayerOperation with args', () => {
            expect(doLayerOperationSpy.calledWith({
              type: LAYER_OPERATION_IMAGEDATA,
              imageData: operation.imageData,
              preventHistoryPush: true
            })).toBeTruthy();
          });
        });
      });
    });
  });
});
