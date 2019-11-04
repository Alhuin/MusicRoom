import { connect } from 'react-redux';

import Inscription from '../screens/Inscription';
import * as actions from '../redux/actions';

// const mapStateToProps = state => ({
//   loggedUser: state.authReducer.loggedUser,
// });

const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
  admin: payload => dispatch(actions.admin(payload)),
});

export default connect(null, mapDispatchToProps)(Inscription);
