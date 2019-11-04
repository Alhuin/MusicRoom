import { connect } from 'react-redux';

import Loading from '../screens/Loading';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

export default connect(mapStateToProps, null)(Loading);
