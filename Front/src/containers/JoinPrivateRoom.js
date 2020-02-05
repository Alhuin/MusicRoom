import { connect } from 'react-redux';

import JoinPrivateRoom from '../components/Home/JoinPrivateRoom';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  shouldUpdatePlaylist: payload => dispatch(actions.shouldUpdatePlaylist(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinPrivateRoom);
