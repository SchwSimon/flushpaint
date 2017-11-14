import { combineReducers } from 'redux';
import settings from './settings';
import layers from './layers';

const FlushPaint = combineReducers({
	settings,
	layers
});

export default FlushPaint;
