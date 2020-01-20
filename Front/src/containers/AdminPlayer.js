import { connect } from 'react-redux';
import AdminPlayer from '../components/AdminPlayer/AdminPlayer';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  track: state.playerReducer.track,
  playlistId: state.playerReducer.playlistId,
  loggedUser: state.authReducer.loggedUser,
  audioElement: state.playerReducer.audioElement,
  socket: state.playerReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  changing: payload => dispatch(actions.isChanging(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPlayer);
