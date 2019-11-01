import { connect } from 'react-redux';
import MiniPlayer from '../components/Playlist/MiniPlayer';
import * as actions from '../actions';

const mapStateToProps = ({ totalLength, currentPosition, track, audioElement }) => ({
  totalLength,
  currentPosition,
  track,
  audioElement,
});

const mapDispatchToProps = dispatch => ({
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  paused: payload => dispatch(actions.paused(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MiniPlayer);
