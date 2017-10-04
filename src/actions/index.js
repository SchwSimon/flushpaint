
export const SET_STROKESTYLE = 'SET_STROKESTYLE';
export const SET_LINEWIDTH = 'SET_LINEWIDTH';
export const SET_LINECAP = 'SET_LINECAP';
export const SET_GLOBALCOMPOSITEOPERATION = 'SET_GLOBALCOMPOSITEOPERATION';
export const PUSH_HISTORY = 'PUSH_HISTORY';
export const UNDO_HISTORY = 'UNDO_HISTORY';

export const LineCaps = {
	ROUND: 'round',
	SQUARE: 'square',
	BUTT: 'butt'
};

export const GlobalCompositeOperations = {
	SOURCE_OVER: 'source-over',
	SOURCE_IN: 'source-in',
	SOURCE_OUT: 'source-out',
	SOURCE_ATOP: 'source-atop',
	DESTINATION_OVER: 'destination-over',
	DESTINATION_IN: 'destination-in',
	DESTINATION_OUT: 'destination-out',
	DESTINATION_ATOP: 'destination-atop',
	LIGHTER: 'lighter',
	COPY: 'copy',
	XOR: 'xor',
	MULTIPLY: 'multiply',
	SCREEN: 'screen',
	OVERLAY: 'overlay',
	DARKEN: 'darken',
	LIGHTEN: 'lighten',
	COLOR_DODGE: 'color-dodge',
	COLOR_BURN: 'color-burn',
	HARD_LIGHT: 'hard-light',
	SOFT_LIGHT: 'soft-light',
	DIFFERENCE: 'difference',
	EXCLUSION: 'exclusion',
	HUE: 'hue',
	SATURATION: 'saturation',
	COLOR: 'color',
	LUMINOSITY: 'luminosity'
};


export function setStrokeStyle(style) {
	return { type: SET_STROKESTYLE, style };
}

export function setLineWidth(width) {
	return { type: SET_LINEWIDTH, width };
}

export function setLineCap(cap) {
	return { type: SET_LINECAP, cap };
}

export function setGlobalCompositeOperation(operation) {
	return { type: SET_GLOBALCOMPOSITEOPERATION, operation };
}

export function pushHistory(data) {
	return { type: PUSH_HISTORY, data };
}

export function undoHistory() {
	return { type: UNDO_HISTORY };
}

