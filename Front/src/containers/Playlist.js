import { connect } from 'react-redux';

import Playlist from '../screens/Playlist';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
  track: state.playerReducer.track,
  playlistId: state.playerReducer.playlistId,
  playlistType: state.playerReducer.playlistType,
  isPaused: state.playerReducer.isPaused,
  nextIndex: state.playerReducer.nextIndex,
  playerOpen: state.playerReducer.playerOpen,
});

const mapDispatchToProps = dispatch => ({
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
  changePlaylistType: payload => dispatch(actions.changePlaylistType(payload)),
  changing: payload => dispatch(dispatch(actions.isChanging(payload))),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  setNextIndex: payload => dispatch(actions.setNextIndex(payload)),
  setPlayerOpen: payload => dispatch(actions.setPlayerOpen(payload)),
  setPlaylistName: payload => dispatch(actions.setPlaylistName(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
