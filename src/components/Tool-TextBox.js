import React, { Component } from 'react';
import { PhotoshopPicker } from 'react-color';

import '../styles/Tool-TextBox.css';

export class TextBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showColorPicker: false,
			textSize: 14,
			textColor: 'black',
			tempTextColor: 'black'
		}

		this.onFontSizeChange = this.onFontSizeChange.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
		this.onColorClick = this.onColorClick.bind(this);
		this.onColorSubmit = this.onColorSubmit.bind(this);
		this.onColorCancel = this.onColorCancel.bind(this);
		this.onPrint = this.onPrint.bind(this);
	}

	componentDidMount() {
		this.textInput.focus();
	}

	onFontSizeChange(event) {
		this.setState({textSize: event.target.value*1})
	}

	onColorClick() {
		this.setState({showColorPicker: true})
	}

	onColorChange(color) {
		this.setState({tempTextColor: color.hex})
	}

	onColorCancel() {
		this.setState({showColorPicker: false})
	}

	onColorSubmit() {
		this.setState({textColor: this.state.tempTextColor})
		this.onColorCancel();
	}

	onPrint() {
		this.props.hideTextbox();

		let textParagraphs = this.textInput.value.split('\n');
		for(let i = 0, len = textParagraphs.length; i < len; i++) {
			this.props.onTextPrint(textParagraphs[i], {
				x: this.props.posX - 2,
				y: (this.props.posY + this.state.textSize - 6) + (i * this.state.textSize) - 1,
				color: this.state.textColor,
				size: this.state.textSize
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.posY !== nextProps.posY
			|| this.props.posX !== nextProps.posX
				|| this.state.textColor !== nextState.textColor
					|| this.state.textSize !== nextState.textSize
						|| this.state.showColorPicker !== nextState.showColorPicker)
			return true;
		return false;
	}

	render() {
		return (
			<div
				className="TextBox"
				style={{
					top: (this.props.posY || 0) - 48,
					left: (this.props.posX || 0) - 64,
				}}
			>
				<div className="TextBox-settings">
					<input
						className="TextBox-fontsize"
						type="number"
						defaultValue={this.state.textSize}
						onChange={this.onFontSizeChange}
					/>
					<div
						className="TextBox-fontcolor"
						style={{backgroundColor:this.state.textColor}}
						onClick={this.onColorClick}
					></div>
					<div className="TextBox-submit button" onClick={this.onPrint}>Print</div>
					<div className="TextBox-close button" onClick={this.props.hideTextbox}>X</div>
				</div>
				<textarea
					ref={input => this.textInput = input}
					className="TextBox-textarea"
					style={{
						fontSize: this.state.textSize,
						lineHeight: this.state.textSize + 'px',
						color: this.state.textColor,
					}}
				/>
				{this.state.showColorPicker &&
					<div className="TextBox-colorpicker">
						<PhotoshopPicker
							header="Font Color Picker"
							color={this.state.tempTextColor}
							onChangeComplete={this.onColorChange}
							onAccept={this.onColorSubmit}
							onCancel={this.onColorCancel}
						/>
					</div>
				}
			</div>
		);
	}
}

export default TextBox;
