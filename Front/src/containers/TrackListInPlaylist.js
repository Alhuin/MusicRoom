import { connect } from 'react-redux';
import TrackListInPlaylist from '../components/Playlist/TrackListInPlaylist';

const mapStateToProps = state => ({
  currentTrack: state.playerReducer.track,
  currentPlaylistId: state.playerReducer.playlistId,
});

export default connect(mapStateToProps, null)(TrackListInPlaylist);
