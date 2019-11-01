import { connect } from 'react-redux';
import PlayerDetails from '../components/Player/PlayerDetails';
import * as actions from '../actions';

const mapStateToProps = ({
  audioElement, currentPosition, isChanging, track, totalLength, isPaused,
}) => ({
  audioElement,
  currentPosition,
  isChanging,
  track,
  totalLength,
  isPaused,
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
