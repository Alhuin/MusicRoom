import { connect } from 'react-redux';
import TrackInPlaylist from '../components/Playlist/TrackInPlaylist';

const mapStateToProps = state => ({
  socket: state.playerReducer.socket,
  currentTrack: state.playerReducer.track,
});

export default connect(mapStateToProps, null)(TrackInPlaylist);
