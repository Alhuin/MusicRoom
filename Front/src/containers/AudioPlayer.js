import { connect } from 'react-redux';
import AudioPlayer from '../components/AdminPlayer/AudioPlayer';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  track: state.playerReducer.track,
  isChanging: state.playerReducer.isChanging,
  isPaused: state.playerReducer.isPaused,
  playlistId: state.playerReducer.playlistId,
  audioElement: state.playerReducer.audioElement,
  socket: state.playerReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  setAudioElement: payload => dispatch(actions.setAudioElement(payload)),
  changing: payload => dispatch(actions.isChanging(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
