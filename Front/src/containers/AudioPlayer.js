import { connect } from 'react-redux';
import AudioPlayer from '../components/AdminPlayer/AudioPlayer';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  track: state.playerReducer.track,
  isChanging: state.playerReducer.isChanging,
  isPaused: state.playerReducer.isPaused,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  setAudioElement: payload => dispatch(actions.setAudioElement(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
