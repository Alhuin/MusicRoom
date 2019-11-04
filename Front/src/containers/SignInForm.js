import { connect } from 'react-redux';

import SignInForm from '../components/Authentication/SignInForm';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
  admin: payload => dispatch(actions.admin(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
