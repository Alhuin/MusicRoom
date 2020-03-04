import { connect } from 'react-redux';
import AdminPlayer from '../components/AdminPlayer/AdminPlayer';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  track: state.playerReducer.track,
  playlistId: state.playerReducer.playlistId,
  playlistType: state.playerReducer.playlistType,
  loggedUser: state.authReducer.loggedUser,
  audioElement: state.playerReducer.audioElement,
  socket: state.playerReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  paused: payload => dispatch(actions.paused(payload)),
  changing: payload => dispatch(actions.isChanging(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
  changePlaylistType: payload => dispatch(actions.changePlaylistType(payload)),
  setPlayerOpen: payload => dispatch(actions.setPlayerOpen(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPlayer);
