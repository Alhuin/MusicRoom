import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import CustomDrawer from '../components/Home/CustomDrawer';

const mapStateToProps = state => ({
  socket: state.playerReducer.socket,
  playlistId: state.playerReducer.playlistId,
});

const mapDispatchToProps = dispatch => ({
  setSocket: payload => dispatch(actions.setSocket(payload)),
  logOut: payload => dispatch(actions.logOut(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);
