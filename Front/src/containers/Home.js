import { connect } from 'react-redux';
import Home from '../screens/Home';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

export default connect(mapStateToProps, null)(Home);
