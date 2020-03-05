import { connect } from 'react-redux';
import PlaylistSettings from '../screens/PlaylistSettings';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
  currentPlaylistId: state.playerReducer.playlistId,
});

const mapDispatchToProps = dispatch => ({
  userChanged: payload => dispatch(actions.userChanged(payload)),
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  setPlayerOpen: payload => dispatch(actions.setPlayerOpen(payload)),
  exitPlayer: () => dispatch(actions.exitPlayer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistSettings);
