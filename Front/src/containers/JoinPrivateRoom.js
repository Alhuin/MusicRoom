import { connect } from 'react-redux';

import JoinPrivateRoom from '../components/Home/JoinPrivateRoom';
import * as actions from '../redux/actions';

const mapDispatchToProps = dispatch => ({
  shouldUpdatePlaylist: payload => dispatch(actions.shouldUpdatePlaylist(payload)),
});

export default connect(null, mapDispatchToProps)(JoinPrivateRoom);
