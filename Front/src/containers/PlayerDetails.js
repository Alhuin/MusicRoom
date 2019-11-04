import { connect } from 'react-redux';
import PlayerDetails from '../components/AdminPlayer/PlayerDetails';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  audioElement: state.playerReducer.audioElement,
  currentPosition: state.playerReducer.currentPosition,
  isChanging: state.playerReducer.isChanging,
  track: state.playerReducer.track,
  totalLength: state.playerReducer.totalLength,
  isPaused: state.playerReducer.isPaused,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  changing: payload => dispatch(actions.isChanging(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  paused: payload => dispatch(actions.paused(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetails);
