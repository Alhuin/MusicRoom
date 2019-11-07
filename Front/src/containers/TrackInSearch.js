import { connect } from 'react-redux';
import TrackInSearch from '../components/SearchTrack/TrackInSearch';

const mapStateToProps = state => ({
  socket: state.playerReducer.socket,
});

export default connect(mapStateToProps, null)(TrackInSearch);
