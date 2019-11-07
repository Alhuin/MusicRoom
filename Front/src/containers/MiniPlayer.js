import { connect } from 'react-redux';
import MiniPlayer from '../components/Playlist/MiniPlayer';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  totalLength: state.playerReducer.totalLength,
  currentPosition: state.playerReducer.currentPosition,
  track: state.playerReducer.track,
  audioElement: state.playerReducer.audioElement,
  playlistId: state.playerReducer.playlistId,
  isPaused: state.playerReducer.isPaused,
  socket: state.playerReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  changing: payload => dispatch(actions.isChanging(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MiniPlayer);
