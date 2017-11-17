import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setLineCap } from '../actions/index';

import '../styles/Tool-LineCap.css';

export const LineCaps = {
	ROUND: 'round',
	SQUARE: 'square',
	BUTT: 'butt'
};

export class LineCap extends PureComponent {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(event) {
		this.props.dispatch(setLineCap(event.target.dataset.cap));
	}

	render() {
		return (
			<div>
				{Object.keys(LineCaps).map((key, index) => (
					<div
						className={'LineCap-button' + ((this.props.lineCap === LineCaps[key]) ? ' active' : '')}
						key={index}
					>
						<div
							className={LineCaps[key]}
							style={{
								backgroundColor: this.props.strokeStyle
							}}
						></div>
						<div className="centerer"></div>
						<div className="LineCap-trigger" onClick={this.onClick} data-cap={LineCaps[key]}></div>
					</div>
				))}
			</div>
		);
	}
}

export default connect(
	state => ({
		lineCap: state.settings.lineCap,				// the selected stroke line cap
		strokeStyle: state.settings.strokeStyle	// the selected color
	})
)(LineCap);
