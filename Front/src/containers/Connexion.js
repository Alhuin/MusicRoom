import { connect } from 'react-redux';

import Connexion from '../screens/Connexion';
import * as actions from '../actions';

const mapStateToProps = ({ isLoggedIn }) => ({
  isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  logged: payload => dispatch(actions.logged(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connexion);
