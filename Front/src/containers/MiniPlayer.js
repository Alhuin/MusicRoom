import { connect } from 'react-redux';
import MiniPlayer from '../components/Playlist/MiniPlayer';
import * as actions from '../actions';

const mapStateToProps = ({
  playlistId, totalLength, currentPosition,track, audioElement, isPaused,
}) => ({
  totalLength,
  currentPosition,
  track,
  audioElement,
  playlistId,
  isPaused,
});

const mapDispatchToProps = dispatch => ({
  changing: payload => dispatch(actions.isChanging(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MiniPlayer);
