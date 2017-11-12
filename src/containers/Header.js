import React, { PureComponent } from 'react';

import '../styles/Header.css';

/**
 * Main settings container
 */
export class Header extends PureComponent {	
	render() {
		return (
			<div className="Header">
				<h1 className="Header-title">FlushPaint</h1>
				<div className="Header-info">Right click on a layer or collage preview to save as image.</div>
			</div>
		);
	}
}


export default Header;
