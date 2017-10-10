export const TOGGLE_DRAWING = 'TOGGLE_DRAWING';
export const TOGGLE_MOVING = 'TOGGLE_MOVING';
export const SET_INTERACTIONTIMEOUT = 'SET_INTERACTIONTIMEOUT';
	
export function toggleDrawing(bool, layerID) {
	return { type: TOGGLE_DRAWING, bool, layerID }
}
export function toggleMoving(bool, layerID) {
	return { type: TOGGLE_MOVING, bool, layerID }
}
export function setInteractionTimeout(timeout) {
	return { type: SET_INTERACTIONTIMEOUT, timeout }
}

