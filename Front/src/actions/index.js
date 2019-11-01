import {
  CHANGE_TRACK, CHANGE_PLAYLIST, LOGGED, SET_TIME, SET_TOTAL_LENGTH,
  SET_DURATION, PAUSED, SET_AUDIO_ELEMENT, IS_CHANGING, SET_CURRENT_POSITION,
} from './types';

export function changeTrack(payload) {
  return ({ type: CHANGE_TRACK, payload });
}

export function changePlaylist(payload) {
  return ({ type: CHANGE_PLAYLIST, payload });
}

export function logged(payload) {
  return ({ type: LOGGED, payload });
}

export function setTime(payload) {
  return ({ type: SET_TIME, payload });
}

export function setDuration(payload) {
  return ({ type: SET_DURATION, payload });
}

export function isChanging(payload) {
  return ({ type: IS_CHANGING, payload });
}

export function paused(payload) {
  return ({ type: PAUSED, payload });
}

export function setAudioElement(payload) {
  return ({ type: SET_AUDIO_ELEMENT, payload });
}

export function setCurrentPosition(payload) {
  return ({ type: SET_CURRENT_POSITION, payload });
}

export function setTotalLength(payload) {
  return ({ type: SET_TOTAL_LENGTH, payload });
}
