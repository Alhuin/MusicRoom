import { connect } from 'react-redux';
import AdminPlayer from '../components/AdminPlayer/AdminPlayer';
import * as actions from '../actions';

const mapStateToProps = ({ track, playlistId, isLoggedIn }) => ({
  track,
  playlistId,
  isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  paused: payload => dispatch(actions.togglePlayPause(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPlayer);
