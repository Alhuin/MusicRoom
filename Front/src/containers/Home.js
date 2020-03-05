import { connect } from 'react-redux';
import Home from '../screens/Home';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
});

export default connect(mapStateToProps, null)(Home);
