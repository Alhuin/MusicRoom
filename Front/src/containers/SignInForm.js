import { connect } from 'react-redux';

import SignInForm from '../components/Authentication/SignInForm';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.authReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
  admin: payload => dispatch(actions.admin(payload)),
  setSocket: payload => dispatch(actions.setSocket(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
