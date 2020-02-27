import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import CustomTabNavigator from '../components/Home/CustomTabNavigator';

const mapStateToProps = state => ({
  socket: state.playerReducer.socket,
  playlistId: state.playerReducer.playlistId,
  loggedUser: state.authReducer.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  setSocket: payload => dispatch(actions.setSocket(payload)),
  logOut: payload => dispatch(actions.logOut(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTabNavigator);
