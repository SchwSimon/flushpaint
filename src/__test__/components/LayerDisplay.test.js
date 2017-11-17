import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { selectLayer, toggleLayer, sortLayers, setLayerTitle } from '../../actions/index';
import { LayerDisplay } from '../../components/LayerDisplay';

Enzyme.configure({ adapter: new Adapter() });

describe('<LayerDisplay />', () => {
  const layers = [1,2,3];
  const dispatchSpy = sinon.spy();
	const wrapper = shallow(<LayerDisplay dispatch={dispatchSpy} layers={layers}/>);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

  describe('functionality', () => {
    const event = {
      target: {
        dataset: {
          layerid: 3
        },
        value: 'value',
        nextSibling: {}
      },
      key: 'Enter'
    };

    describe('function onLayerSelect()', () => {
      it('must trigger dispatch with selectLayer', () => {
        wrapper.instance().onLayerSelect(event);
    		expect(dispatchSpy.calledWith(selectLayer(3))).toBeTruthy();
      });
    });

    describe('function onLayerToggle()', () => {
      it('must trigger dispatch with toggleLayer', () => {
        wrapper.instance().onLayerToggle(event);
        expect(dispatchSpy.calledWith(toggleLayer(3))).toBeTruthy();
      });
    });

    describe('function onSortEnd()', () => {
      it('must trigger dispatch with sortLayers', () => {
        const args = {
          oldIndex: 3,
          newIndex: 4
        };
        wrapper.instance().onSortEnd(args);
        expect(dispatchSpy.calledWith(sortLayers(
          (layers.length-1) - args.oldIndex,
          (layers.length-1) - args.newIndex,
        ))).toBeTruthy();
      });
    });

    describe('function onTitleSubmit()', () => {
      it('must trigger dispatch with setLayerTitle', () => {
        wrapper.instance().onTitleSubmit(event);
        expect(dispatchSpy.calledWith(setLayerTitle(3, 'value'))).toBeTruthy();
      });
    });
  });
});
