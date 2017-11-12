import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { selectLayer, toggleLayer, sortLayersOrder, setLayerTitle } from '../actions/index';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import '../styles/LayerDisplay.css';

/**
 * The drag event trigger element
 */
const DragHandle = SortableHandle(() => (
	<div className="LayerDisplay-layer-dragHandle">
		<div className="LayerDisplay-layer-dragHandle-icon" />
	</div>
));

/**
 * The sortable layer list
 */
const LayerListItem = SortableElement((props) => (
	<div className={'LayerDisplay-layer' + (props.isSelected ? ' active' : '')}>
		<DragHandle />
		<input
			className="LayerDisplay-layer-title"
			key={props.layerID}
			data-layerid={props.layerID}
			type="text"
			defaultValue={props.title}
			onKeyDown={props.onTitleSubmit}
			disabled />
		<div
			className="LayerDisplay-layer-trigger"
			onClick={props.onLayerSelect}
			data-layerid={props.layerID}
			onDoubleClick={props.onTitleEdit}
		></div>
		<div className="LayerDisplay-layer-visibility">
			<div
				className="LayerDisplay-layer-visibilityTrigger"
				data-visibility={props.isVisible ? 'true' : 'false'}
				data-layerid={props.layerID}
				onClick={props.onLayerToggle}
			></div>
		</div>
	</div>
));

/**
 * The sortable layer list container
 */
const LayerList = SortableContainer((props) => (
	<div className="LayerDisplay-list">
		{Object.assign([], props.layers).reverse().map((layer, index) => (
			<LayerListItem
				key={index}
				index={index}
				layerID={layer.id}
				title={layer.title}
				isVisible={layer.isVisible}
				isSelected={layer.id === props.selectedLayerID}
				onLayerSelect={props.onLayerSelect}
				onLayerToggle={props.onLayerToggle}
				onTitleEdit={props.onTitleEdit}
				onTitleSubmit={props.onTitleSubmit}
			/>
		))}
	</div>
));

/**
 * Display a sortable list of the given layers,
 * the list sorting represents the Z index of the layers
 * where the first layer in the list is the front layer
 */
class LayerDisplay extends PureComponent {
	constructor(props) {
		super(props);

		this.onLayerSelect = this.onLayerSelect.bind(this);
		this.onLayerToggle = this.onLayerToggle.bind(this);
		this.onSortEnd = this.onSortEnd.bind(this);
		this.onTitleEdit = this.onTitleEdit.bind(this);
		this.onTitleSubmit = this.onTitleSubmit.bind(this);
	}

	// select the layer
	onLayerSelect(event) {
		this.props.dispatch(selectLayer(event.target.dataset.layerid));
	}

	// toggle the layer's visibility
	onLayerToggle(event) {
		this.props.dispatch(toggleLayer(event.target.dataset.layerid));
	}

	// resort the layers order array
	onSortEnd({oldIndex, newIndex}) {
		this.props.dispatch(sortLayersOrder(oldIndex, newIndex));
	}

	// enable title editing
	onTitleEdit(event) {
		event.target.previousSibling.removeAttribute('disabled');
		event.target.previousSibling.focus();
		event.target.hidden = true;
	}

	// disable title editing and save the title, by pressing enter
	onTitleSubmit(event) {
		if (event.key === 'Enter') {
			event.target.disabled = true;
			event.target.nextSibling.hidden = false;
			this.props.dispatch(setLayerTitle(event.target.dataset.layerid, event.target.value));
		}
	}

	render() {
		return (
			<div className="LayerDisplay">
				<LayerList
					useDragHandle={true}
					layers={this.props.layers}
					selectedLayerID={this.props.selectedLayerID}
					onLayerSelect={this.onLayerSelect}
					onLayerToggle={this.onLayerToggle}
					onSortEnd={this.onSortEnd}
					onTitleEdit={this.onTitleEdit}
					onTitleSubmit={this.onTitleSubmit}
				/>
			</div>
		);
	}
}

export default connect(
	state => ({
		selectedLayerID: state.layers.selectedID,	// the currently selected layer id
		layers: state.layers.layers							// the layers array
	})
)(LayerDisplay);
