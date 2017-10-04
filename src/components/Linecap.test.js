import React from 'react';
import ReactDOM from 'react-dom';
import Linecap from './Linecap';

describe('Linecap', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Linecap />, div);
	});
});


