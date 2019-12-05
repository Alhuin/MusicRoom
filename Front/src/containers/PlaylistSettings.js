import { connect } from 'react-redux';
import PlaylistSettings from '../screens/PlaylistSettings';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistSettings);
