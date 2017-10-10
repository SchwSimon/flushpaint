// react dependencies
import React from 'react';
import ReactDOM from 'react-dom';

// redux dependencies
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// service worker dependencies for Progressive Web Apps
import registerServiceWorker from './registerServiceWorker';

// global styles
import './index.css';

// FlushPaint reducer
import FlushPaint from './reducers/index';

// Apps
import App from './containers/App';

// the store
let store = createStore(FlushPaint);

// log store changes
store.subscribe(() => {
	console.log(store.getState())
});

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

// register service worker...
registerServiceWorker();
