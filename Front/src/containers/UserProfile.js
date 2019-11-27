import { connect } from 'react-redux';
import UserProfile from '../screens/UserProfile';
// import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

/* const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
}); */

export default connect(mapStateToProps, null)(UserProfile);
