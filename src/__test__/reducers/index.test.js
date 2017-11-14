import { createStore } from 'redux';
import AppStore from '../../reducers/index';
import { settingsInitialState } from '../../reducers/Settings';
import { layersInitialState } from '../../reducers/Layers';

describe('store', () => {
	it('must create a correct store', () => {
		const store = createStore(AppStore)
		expect(store.getState()).toEqual({
			settings: settingsInitialState,
      layers: layersInitialState
		});
  });
});
