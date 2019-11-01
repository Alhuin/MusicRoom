import { connect } from 'react-redux';
import AudioPlayer from '../components/AdminPlayer/AudioPlayer';
import * as actions from '../actions';

const mapStateToProps = ({ track, isChanging, isPaused }) => ({
  track,
  isChanging,
  isPaused,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  setAudioElement: payload => dispatch(actions.setAudioElement(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
