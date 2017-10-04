import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import flushPaint from './reducers/index';

import './index.css';
import App from './App';

let store = createStore(flushPaint);

// store.subscribe(() => {
	// console.log(store.getState())
// });

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);