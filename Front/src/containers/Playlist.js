import { connect } from 'react-redux';

import Playlist from '../screens/Playlist';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
  track: state.playerReducer.track,
});

const mapDispatchToProps = dispatch => ({
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
