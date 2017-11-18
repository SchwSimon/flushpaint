import { createStore } from 'redux';
import AppStore from '../../reducers/index';
import { settingsInitialState } from '../../reducers/settings';
import { layersInitialState } from '../../reducers/layers';

describe('store', () => {
	it('must create a correct store', () => {
		const store = createStore(AppStore)
		expect(store.getState()).toEqual({
			settings: settingsInitialState,
      layers: layersInitialState
		});
  });
});
