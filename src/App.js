import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import LineWidth from  './Linewidth';
import LineCap from  './Linecap';
import './App.css';

class Drawboard extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isDrawing: false
		}
		
		this.enableDrawing = this.enableDrawing.bind(this);
		this.disableDrawing = this.disableDrawing.bind(this);
		this.draw = this.draw.bind(this);
		this.onResize = this.onResize.bind(this);
	}
	
	updateOffset() {
		const clientRect = this.refs.drawboard.getBoundingClientRect();
		this.setState({
			offsetLeft: clientRect.left,
			offsetTop: clientRect.top
		});
	}
	
	enableDrawing(event) {
		event.preventDefault();
		event.stopPropagation();
		event.persist();
		
		this.setState({
			isDrawing: true
		}, () => this.draw(event) );
	}
	disableDrawing() {
		this.setState({
			isDrawing: false
		});
	}
	
	draw(event) {
		if (this.state.isDrawing) {
			event.preventDefault();
			event.stopPropagation();

			const toX = event.clientX - this.state.offsetLeft;
			const toY = event.clientY - this.state.offsetTop;
			const ctx = event.target.getContext('2d');
			ctx.strokeStyle = this.props.strokeStyle;
			ctx.lineCap = this.props.lineCap;
			ctx.lineWidth = this.props.lineWidth;
			ctx.globalCompositeOperation = this.props.globalCompositeOperation;
			ctx.beginPath();
			ctx.moveTo( toX, toY );
			ctx.lineTo( toX, toY + 0.1 );
			ctx.stroke();
		}
	}
	
	onResize() {
		this.updateOffset();
	}
	
	componentDidMount() {
		this.updateOffset();
		
		window.addEventListener('resize', this.onResize, false);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize, false);
	}
	
	render() {
		return (
			<canvas
				ref="drawboard"
				className="App-drawboard"
				width="800px"
				height="400px"
				onMouseDown={this.enableDrawing}
				onMouseMove={this.draw}
				onMouseUp={this.disableDrawing}
				onMouseOut={this.disableDrawing}
			></canvas>
		);
	}
}

class Settings extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			appName: '',
		}
		
		this.openApp = this.openApp.bind(this);
		this.closeApp = this.closeApp.bind(this);
		this.updateSetting = this.updateSetting.bind(this);
	}

	openApp(event) {
		this.setState({
			appName: event.target.getAttribute('name'),
			component: event.target.getAttribute('name'),
		});
	}
	
	closeApp() {
		this.setState({
			appName: ''
		});
	}
	
	updateSetting(name, value) {
		if ( value ) {
			this.props.updateSetting(name, value);
		}
		this.closeApp();
	}
	
	render() {
		return (
			<div className="App-settings">
				<div className="App-settings-nav">
					<button onClick={this.openApp} name="strokeStyle">Color</button>
					<button onClick={this.openApp} name="lineWidth">Size</button>
					<button onClick={this.openApp} name="lineCap">Type</button>
				</div>
				<SettingsApp
					name={this.state.appName}
					value={this.props[this.state.appName]}
					onClose={this.closeApp}
					updateSetting={this.updateSetting}
				/>
			</div>
		);
	}
}

class SettingsApp extends Component {
	constructor(props) {
		super(props);
		
		this.apps = {
			strokeStyle: {
				component: SketchPicker,
				initPropName: 'color',
				callbackName: 'onChangeComplete',
				callback: function(value) {
					this.apps.strokeStyle.value = 'rgba(' + value.rgb.r + ',' + value.rgb.g + ',' + value.rgb.b + ',' + value.rgb.a + ')';
				}.bind(this)
			},
			lineWidth: {
				component: LineWidth,
			},
			lineCap: {
				component: LineCap,
			}
		}
		
		this.onSave = this.onSave.bind(this);
	}
	
	onSave() {
		this.props.updateSetting( this.props.name, this.apps[this.props.name].value || null );
	}
	
	render() {
		if ( !this.props.name ) {
			return null;
		}
		
		const SettingComponent = this.apps[this.props.name].component;
		const SettingProps = {
			[this.apps[this.props.name].callbackName || 'onChange']: this.apps[this.props.name].callback || function(value) { this.apps[this.props.name].value = value }.bind(this),
			[this.apps[this.props.name].initPropName || this.props.name]: this.props.value
		};
		
		return (
			<div className="App-settings-appHolder">
				<div className="App-settings-appHead">
					<button className="App-settings-app-close" onClick={this.props.onClose}>Close</button>
					<button className="App-settings-app-save" onClick={this.onSave}>Save</button>
				</div>
				<div className="App-settings-appMain">
					<SettingComponent {...SettingProps} className="App-settings-app" />
				</div>
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			strokeStyle: 'rgba(0,0,0,1)',
			lineWidth: 4,
			lineCap: 'round',
			globalCompositeOperation: 'source-over'
		};
		
		this.updateSetting = this.updateSetting.bind(this);
	}
	
	updateSetting(name, value) {
		this.setState({
			[name]: value
		});
	}
	
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">FlushPaint</h1>
				</header>
				<Settings updateSetting={this.updateSetting} {...this.state} />
				<Drawboard {...this.state} />
			</div>
		);
	}
}

export default App;