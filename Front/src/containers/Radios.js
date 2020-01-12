import { connect } from 'react-redux';
import Radios from '../screens/Radios';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
  shouldUpdate: state.playerReducer.shouldUpdatePlaylist,
});

const mapDispatchToProps = dispatch => ({
  shouldUpdatePlaylist: payload => dispatch(actions.shouldUpdatePlaylist(payload)),
//   changing: payload => dispatch(actions.isChanging(payload)),
//   setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
//   paused: payload => dispatch(actions.paused(payload)),
//   setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
//   changeTrack: payload => dispatch(actions.changeTrack(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radios);
