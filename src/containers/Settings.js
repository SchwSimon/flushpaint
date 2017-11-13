import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Tool, { ToolList } from  '../components/Tool';
import LineWidth from  '../components/Tool-LineWidth';
import LineCap from  '../components/Tool-LineCap';
import History from  '../components/Tool-History';
import GlobalCompositeOperation from  '../components/Tool-GlobalCompositeOperation';
import LayerHandler from  '../components/LayerHandler';
import LayerRenderer from '../components/LayerRenderer';
import { SketchPicker } from 'react-color';

import { setStrokeStyle } from '../actions/index';

import '../styles/Settings.css';

/**
 * Main settings container
 */
export class Settings extends PureComponent {
	render() {
		return (
			<div className="Settings">
				<div className="Settings-container">
					<SketchPicker
						color={this.props.strokeStyle}
						onChangeComplete={color => this.props.dispatch(setStrokeStyle(color.rgb))}
					/>
				</div>
				<div className="Settings-container">
					<LineWidth />
					<LineCap />
					<Tool tool={ToolList.BRUSH} />
					<GlobalCompositeOperation />
					{Object.keys(ToolList).map((key, index) => {
						return (ToolList[key] === ToolList.BRUSH)
							? null : <Tool key={index} tool={ToolList[key]} />
					})}
					<LayerRenderer />
					<History />
				</div>
				<div className="Settings-container">
					<LayerHandler />
				</div>
			</div>
		);
	}
}


export default connect(
	state => ({ strokeStyle: state.settings.strokeStyle })		// the currently selected strokeStyle (color)
)(Settings);
