import { connect } from 'react-redux';
import AdminPlayer from '../components/AdminPlayer/AdminPlayer';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  track: state.playerReducer.track,
  playlistId: state.playerReducer.playlistId,
  loggedUser: state.authReducer.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  setTime: payload => dispatch(actions.setTime(payload)),
  setDuration: payload => dispatch(actions.setDuration(payload)),
  paused: payload => dispatch(actions.paused(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPlayer);
