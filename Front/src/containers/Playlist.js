import { connect } from 'react-redux';

import Playlist from '../screens/Playlist';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
  socket: state.playerReducer.socket,
  track: state.playerReducer.track,
  playlistId: state.playerReducer.playlistId,
});

const mapDispatchToProps = dispatch => ({
  changeTrack: payload => dispatch(actions.changeTrack(payload)),
  changePlaylist: payload => dispatch(actions.changePlaylist(payload)),
  changing: payload => dispatch(dispatch(actions.isChanging(payload))),
  setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
  setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
  paused: payload => dispatch(actions.paused(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
