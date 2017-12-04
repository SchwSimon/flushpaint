import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Layer from '../components/Layer';
import { addLayer, disableInteraction } from '../actions/index';

import '../styles/Drawboard.css';

/**
 * Main container which contains all the canvas layers
 */
export class Drawboard extends PureComponent {
	componentDidMount() {
		this.setState({
			clientWidth: this.drawboard.clientWidth,
			clientHeight: this.drawboard.clientHeight
		});

			// add one layer to start
		this.props.dispatch(addLayer({
			width: 600,
			height: 400
		}));
	}

	render() {
		return (
			<div
				id="Drawboard"
				ref={drawboard => this.drawboard = drawboard}
				onMouseUp={() => this.props.dispatch(disableInteraction())}
			>
				{this.props.layers && this.props.layers.map(layer => (
					<Layer
						key={layer.id}
						layerID={layer.id}
						title={layer.title}
						width={layer.width}
						height={layer.height}
						drawboard={{
							clientWidth: this.state.clientWidth,
							clientHeight: this.state.clientHeight
						}}
						isVisible={layer.isVisible}
						isSelected={layer.id === this.props.selectedLayerID}
					/>
				))}
			</div>
		);
	}
}

export default connect(
	state => ({
		layers: state.layers.layers,							// the layers array
		selectedLayerID: state.layers.selectedID	// the selected layer id
	})
)(Drawboard);
