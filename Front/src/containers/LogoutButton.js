import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import LogoutButton from '../components/Home/LogoutButton';

const mapStateToProps = state => ({
  socket: state.playerReducer.socket,
});

const mapDispatchToProps = dispatch => ({
  setSocket: payload => dispatch(actions.setSocket(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
