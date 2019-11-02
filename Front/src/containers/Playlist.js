import { connect } from 'react-redux';

import Connexion from '../screens/Playlist';
import * as actions from '../redux/actions';

const mapDispatchToProps = dispatch => ({
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
});

export default connect(null, mapDispatchToProps)(Connexion);
