import {
  CHANGE_PLAYLIST, CHANGE_TRACK, SET_DURATION, SET_TOTAL_LENGTH, SET_SOCKET,
  PAUSED, SET_TIME, SET_AUDIO_ELEMENT, IS_CHANGING, SET_CURRENT_POSITION, SHOULD_UPDATE_PLAYLIST,
} from '../actions/types';

const initialState = {
  track: null,
  playlistId: '',
  totalLength: 1,
  isPaused: true,
  audioElement: null,
  currentPosition: 0,
  isChanging: false,
  socket: null,
  shouldUpdatePlaylist: false,
};

const playerReducer = (state = initialState, action) => {
  // console.log(action.type, action.payload);
  switch (action.type) {
    case CHANGE_TRACK:
      return {
        ...state, track: action.payload,
      };
    case CHANGE_PLAYLIST:
      return {
        ...state, playlistId: action.payload,
      };
    case PAUSED:
      return {
        ...state, isPaused: action.payload,
      };
    case SET_TIME:
      return {
        ...state, currentPosition: Math.floor(action.payload.currentTime),
      };
    case SET_CURRENT_POSITION:
      return {
        ...state, currentPosition: action.payload,
      };
    case SET_DURATION:
      return {
        ...state, totalLength: Math.floor(action.payload.duration),
      };
    case SET_TOTAL_LENGTH:
      return {
        ...state, totalLength: action.payload,
      };
    case SET_AUDIO_ELEMENT:
      return {
        ...state, audioElement: action.payload,
      };
    case IS_CHANGING:
      return {
        ...state, isChanging: action.payload,
      };
    case SET_SOCKET:
      return {
        ...state, socket: action.payload,
      };
    case SHOULD_UPDATE_PLAYLIST:
      return {
        ...state, shouldUpdatePlaylist: action.payload,
      };
    default:
      return state;
  }
};

// const store = createStore(playerStore);
export default playerReducer;
