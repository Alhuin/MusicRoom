import { connect } from 'react-redux';

import Connexion from '../screens/Connexion';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  isLoggedIn: state.authReducer.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  logged: payload => dispatch(actions.logged(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connexion);
