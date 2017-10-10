import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Layer from '../components/Layer';

import '../styles/Drawboard.css';

/**
 * Main container which contains all the canvas layers
 */
class Drawboard extends PureComponent {
	render() {
		return (
			<div id="Drawboard">
				{this.props.layers.map((layer, index) => {
					return (
						<Layer
							key={layer.id}
							layerID={layer.id}
							isVisible={layer.isVisible}
							isSelected={layer.id === this.props.selectedLayerID}
							width={layer.width}
							height={layer.height}
						/>
					);
				})}
			</div>
		);
	}
}

export default connect(
	state => ({
		layers: state.layers.layers,						// the layers array
		selectedLayerID: state.layers.selectedID	// the selected layer id
	})
)(Drawboard);