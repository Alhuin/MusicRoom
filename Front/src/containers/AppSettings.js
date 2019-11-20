import { connect } from 'react-redux';
import AppSettings from '../screens/AppSettings';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
