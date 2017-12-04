import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setStrokeStyle, addLayer, selectLayer, enableMoving, enableDrawing, disableInteraction,
 pushHistory, updatePosition, layerOperationDone, resizeLayer, removeLayer, drawLayerImage,
 LAYER_OPERATION_FILL, LAYER_OPERATION_CLEAR, LAYER_OPERATION_COLORTOTRANSPARENT,
 LAYER_OPERATION_IMAGEDATA, LAYER_OPERATION_IMAGE, LAYER_OPERATION_CROP,
 LAYER_OPERATION_CLONE, LAYER_OPERATION_MERGE, LAYER_OPERATION_UNDO } from '../../actions/index';
import { ToolList } from '../../components/Tool';

Enzyme.configure({ adapter: new Adapter() });

import { Layer } from '../../components/Layer';

describe('<Layer />', () => {
  const dispatchSpy = sinon.spy();
  const props = {
    dispatch: dispatchSpy,
    title: 'title',
    width: 100,
    height: 100,
    settings: {
      tool: null
    },
    layerID: 1,
    drawboard: {
      clientHeight: 200,
      clientWidth: 400
    },
    layerOperation: {
      id: 1
    }
  };
  const getBoundingClientRectReturn = {
    left: 1,
    right: 2,
    top: 3,
    bottom: 4
  };
  const getContextReturn = {
    getImageData: () => ({
      data: [1,2,3,4]
    }),
    putImageData: () => {},
    drawImage: () => {},
    fillText: () => {},
    rect: () => {},
    fill: () => {},
    lineCap: null,
    lineWidth: null,
    strokeStyle: null,
    globalCompositeOperation: null
  };
  const onPositionUpdateStub = sinon.stub(Layer.prototype, 'onPositionUpdate');
  const doLayerOperationStub = sinon.stub(Layer.prototype, 'doLayerOperation');
	const wrapper = shallow(<Layer {...props} />);
  const defaultState = Object.assign({}, wrapper.state());
  wrapper.instance().layer = {
    getBoundingClientRect: () => getBoundingClientRectReturn,
    getContext: () => getContextReturn,
    width: 1,
    height: 2
  };
  onPositionUpdateStub.restore();
  doLayerOperationStub.restore();

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
		expect(defaultState).toEqual({
      showTextbox: false,
      top: (props.drawboard.clientHeight/2) - (props.height/2),
      left: (props.drawboard.clientWidth/2) - (props.width/2)
    });
  });

  describe('Lifecycle', () => {
    describe('componentDidMount', () => {
      it('must have called onPositionUpdate', () => {
        expect(onPositionUpdateStub.called).toBeTruthy();
      });

      it('must have called doLayerOperation with args', () => {
        expect(doLayerOperationStub.calledWith(props.layerOperation)).toBeTruthy();
      });
    });

    describe('componentWillReceiveProps', () => {
      it('must trigger doLayerOperation with args', () => {
        const nextProps = {
          layerOperation: {
            id: props.layerID,
            test: 'componentWillReceiveProps'
          },
          layerID: props.layerID
        };
        const doLayerOperationStub = sinon.stub(wrapper.instance(), 'doLayerOperation');
        wrapper.instance().componentWillReceiveProps(nextProps);
        doLayerOperationStub.restore();
        expect(doLayerOperationStub.calledWith(nextProps.layerOperation)).toBeTruthy();
      });
    });

    describe('componentDidUpdate', () => {
      it('must trigger onPositionUpdate', () => {
        const prevProps = {
          width: 1,
          height: 2
        };
        const prevState = {
          left: 3,
          right: 4
        };
        const onPositionUpdateStub = sinon.stub(wrapper.instance(), 'onPositionUpdate');
        wrapper.instance().componentDidUpdate(prevProps, prevState);
        onPositionUpdateStub.restore();
        expect(onPositionUpdateStub.called).toBeTruthy();
      });
    });
  });

  describe('functionality', () => {
    describe('function onPositionUpdate()', () => {
      it('must set state:positionUpdateTimeout', () => {
        wrapper.instance().onPositionUpdate(false);
        expect(wrapper.state().positionUpdateTimeout).toBeTruthy();
      });

      it('must trigger dispatch with updatePosition', () => {
        wrapper.state().positionUpdateTimeout = null;
        wrapper.instance().onPositionUpdate(true);
        expect(dispatchSpy.calledWith(updatePosition(props.layerID, {
          left: getBoundingClientRectReturn.left,
          right: getBoundingClientRectReturn.right,
          top: getBoundingClientRectReturn.top,
          bottom: getBoundingClientRectReturn.bottom
        }))).toBeTruthy();
      });
    });


    describe('function onMouseDown()', () => {
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: 1,
        clientY: 2
      };

      it('must trigger function and set the correct state', () => {
        wrapper.find('.canvas').simulate('mousedown', event);
        expect(wrapper.state()).toMatchObject({
          clientX: event.clientX,
    			clientY: event.clientY,
    			offsetLeft: getBoundingClientRectReturn.left,
    			offsetTop: getBoundingClientRectReturn.top
        });
      });

      describe('settings.tool switch', () => {
        it('must trigger enableDrawing', () => {
          const enableDrawingStub = sinon.stub(wrapper.instance(), 'enableDrawing');
          wrapper.setProps({settings: {tool: ToolList.BRUSH}});
          wrapper.instance().onMouseDown(event);
          enableDrawingStub.restore();
          expect(enableDrawingStub.called).toBeTruthy();
        });

        it('must trigger enableDrawing', () => {
          const enableDrawingStub = sinon.stub(wrapper.instance(), 'enableDrawing');
          wrapper.setProps({settings: {tool: ToolList.ERASER}});
          wrapper.instance().onMouseDown(event);
          enableDrawingStub.restore();
          expect(enableDrawingStub.called).toBeTruthy();
        });

        it('must trigger enableMoving', () => {
          const enableMovingStub = sinon.stub(wrapper.instance(), 'enableMoving');
          wrapper.setProps({settings: {tool: ToolList.MOVE}});
          wrapper.instance().onMouseDown(event);
          enableMovingStub.restore();
          expect(enableMovingStub.called).toBeTruthy();
        });

        it('must trigger absorbColor', () => {
          const absorbColorStub = sinon.stub(wrapper.instance(), 'absorbColor');
          wrapper.setProps({settings: {tool: ToolList.PIPETTE}});
          wrapper.instance().onMouseDown(event);
          absorbColorStub.restore();
          expect(absorbColorStub.called).toBeTruthy();
        });

        it('must set the state correctly', () => {
          wrapper.setProps({settings: {tool: ToolList.TEXT}});
          wrapper.instance().onMouseDown(event);
          expect(wrapper.state()).toMatchObject({
            showTextbox: true,
						toolClickX: event.clientX - getBoundingClientRectReturn.left,
						toolClickY: event.clientY - getBoundingClientRectReturn.top
          });
        });
      });
    });

    describe('function onMouseMove()', () => {
      const event = {
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: 111,
        clientY: 222
      };

      it('must trigger draw with args', () => {
        const drawStub = sinon.stub(wrapper.instance(), 'draw');
        wrapper.setProps(Object.assign({}, props, {
          interaction: {layerID: 1, draw: true}
        }));
        wrapper.find('.canvas').simulate('mousemove', event);
        drawStub.restore();
        expect(drawStub.calledWith(111, 222)).toBeTruthy();
      });

      it('must trigger move with args', () => {
        const moveStub = sinon.stub(wrapper.instance(), 'move');
        wrapper.setProps(Object.assign({}, props, {
          interaction: {layerID: 1, move: true}
        }));
        wrapper.find('.canvas').simulate('mousemove', event);
        moveStub.restore();
        expect(moveStub.calledWith(111, 222)).toBeTruthy();
      });
    });

    describe('function enableMoving()', () => {
      wrapper.instance().enableMoving();

      it('must trigger dispatch with selectLayer', () => {
        expect(dispatchSpy.calledWith(selectLayer(props.layerID))).toBeTruthy();
      });

      it('must trigger dispatch with enableMoving', () => {
        expect(dispatchSpy.calledWith(enableMoving(props.layerID))).toBeTruthy();
      });
    });

    describe('function enableDrawing()', () => {
      const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
      const drawStub = sinon.stub(wrapper.instance(), 'draw');
      wrapper.instance().enableDrawing();
      pushHistoryStub.restore();
      drawStub.restore();

      it('must trigger pushHistory', () => {
        expect(pushHistoryStub.called).toBeTruthy();
      });

      it('must trigger dispatch with enableDrawing', () => {
        expect(dispatchSpy.calledWith(enableDrawing(props.layerID))).toBeTruthy();
      });

      it('must trigger draw()', () => {
        expect(drawStub.called).toBeTruthy();
      });
    });

    describe('function disableInteraction()', () => {
      it('must trigger dispatch with disableInteraction', () => {
        wrapper.find('.canvas').simulate('mouseup');
        expect(dispatchSpy.calledWith(disableInteraction())).toBeTruthy();
      });
    });

    describe('function move()', () => {
      it('must set the correct state', () => {
        wrapper.state().left = 1;
        wrapper.state().top = 2;
        wrapper.state().clientX = 3;
        wrapper.state().clientY = 4;
        wrapper.instance().move(5, 6);
        expect(wrapper.state()).toMatchObject({
          left: 1 + (5 - 3),
          top: 2 + (6 - 4),
          clientX: 5,
    			clientY: 6
        });
      });
    });

    describe('function absorbColor()', () => {
      it('must trigger dispatch with setStrokeStyle', () => {
        wrapper.instance().absorbColor();
        expect(dispatchSpy.calledWith(setStrokeStyle(getContextReturn.getImageData().data))).toBeTruthy();
      });
    });

    describe('function onTextPrint()', () => {
      const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
      wrapper.instance().onTextPrint('text', 'settings');
      pushHistoryStub.restore();

      it('must trigger pushHistory', () => {
        expect(pushHistoryStub.called).toBeTruthy();
      });
    });

    describe('function pushHistory()', () => {
      wrapper.instance().pushHistory();

      it('must trigger dispatch with pushHistory (withPosition = false)', () => {
        expect(dispatchSpy.calledWith(pushHistory(
          props.layerID,
          getContextReturn.getImageData(),
          null
        ))).toBeTruthy();
      });

      it('must trigger dispatch with pushHistory (withPosition = true)', () => {
        wrapper.state().left = 1;
        wrapper.state().top = 2;
        wrapper.instance().pushHistory(true);
        expect(dispatchSpy.calledWith(pushHistory(
          props.layerID,
          getContextReturn.getImageData(),
          {left: 1, top: 2}
        ))).toBeTruthy();
      });
    });

    describe('function doLayerOperation()', () => {
      it('must trigger dispatch with layerOperationDone', () => {
        wrapper.instance().doLayerOperation({});
        expect(dispatchSpy.calledWith(layerOperationDone())).toBeTruthy();
      });

      describe('switch(operation.type)', () => {
        describe('LAYER_OPERATION_FILL', () => {
          const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_FILL
          });
          pushHistoryStub.restore();

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.called).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_CLEAR', () => {
          const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_CLEAR
          });
          pushHistoryStub.restore();

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.called).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_COLORTOTRANSPARENT', () => {
          const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_COLORTOTRANSPARENT,
            color: 'rgba(30,30,30,1)'
          });
          pushHistoryStub.restore();

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.called).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_IMAGEDATA', () => {
          const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_IMAGEDATA,
            imageData: {
              width: wrapper.instance().layer.width,
              height: wrapper.instance().layer.height,
            }
          });
          pushHistoryStub.restore();

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.called).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_IMAGE', () => {
          const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_IMAGE,
            image: 'image'
          });
          pushHistoryStub.restore();

          it('must trigger pushHistory', () => {
            expect(pushHistoryStub.called).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_CROP', () => {
          const doLayerOperationSpy = sinon.spy(wrapper.instance(), 'doLayerOperation');
          const pushHistoryStub = sinon.stub(wrapper.instance(), 'pushHistory');
          wrapper.state().left = 1;
          wrapper.state().top = 2;
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_CROP,
            cropData: {left: 3, top: 4, width: 5, height: 6}
          });
          const state = wrapper.state();
          doLayerOperationSpy.restore();
          pushHistoryStub.restore();

          it('must trigger pushHistory (with arg: true)', () => {
            expect(pushHistoryStub.calledWith(true)).toBeTruthy();
          });

          it('must set the state correctly', () => {
            expect(state).toMatchObject({
              left: 1 + 3,
              top: 2 + 4
            });
          });

          it('must trigger dispatch with resizeLayer', () => {
            expect(dispatchSpy.calledWith(resizeLayer(props.layerID, {
              width: 5,
              height: 6
            }))).toBeTruthy();
          });

          it('must trigger doLayerOperation with args', () => {
            expect(doLayerOperationSpy.calledWith({
              type: LAYER_OPERATION_IMAGEDATA,
              imageData: getContextReturn.getImageData(),
              preventHistoryPush: true
            })).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_CLONE', () => {
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_CLONE,
          });

          it('must trigger dispatch with addLayer', () => {
            expect(dispatchSpy.calledWith(addLayer({
              width: wrapper.instance().layer.width,
              height: wrapper.instance().layer.height,
              title: props.title + ' (copy)'
            }, {
              type: LAYER_OPERATION_IMAGEDATA,
              imageData: getContextReturn.getImageData()
            }))).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_MERGE', () => {
          const getElementByIdStub = sinon.stub(document, 'getElementById').returns({
            getBoundingClientRect: () => getBoundingClientRectReturn
          });
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_MERGE,
            targetLayerID: 9,
            position: {
              left: 1,
              top: 2
            }
          });
          getElementByIdStub.restore();

          it('must trigger dispatch with drawLayerImage', () => {
            expect(dispatchSpy.calledWith(drawLayerImage(
              9,
              wrapper.instance().layer,
              [ -(getBoundingClientRectReturn.left - getBoundingClientRectReturn.left),
                -(getBoundingClientRectReturn.top - getBoundingClientRectReturn.top) ]
            ))).toBeTruthy();
          });

          it('must trigger dispatch with removeLayer', () => {
            expect(dispatchSpy.calledWith(removeLayer(props.layerID))).toBeTruthy();
          });
        });

        describe('LAYER_OPERATION_UNDO', () => {
          const doLayerOperationSpy = sinon.spy(wrapper.instance(), 'doLayerOperation');
          wrapper.instance().doLayerOperation({
            type: LAYER_OPERATION_UNDO,
            position: {left: 1, top: 2},
            imageData: {width: 3, height: 4}
          });
          doLayerOperationSpy.restore();

          it('must set the state correctly', () => {
            expect(wrapper.state()).toMatchObject({
              left: 1,
              top: 2
            });
          });

          it('must trigger dispatch with resizeLayer', () => {
            expect(dispatchSpy.calledWith(resizeLayer(props.layerID, {
              width: 3,
              height: 4
            }))).toBeTruthy();
          });

          it('must trigger doLayerOperation with args', () => {
            expect(doLayerOperationSpy.calledWith({
              type: LAYER_OPERATION_IMAGEDATA,
              imageData: {width: 3, height: 4},
              preventHistoryPush: true
            })).toBeTruthy();
          });
        });
      });
    });
  });
});
