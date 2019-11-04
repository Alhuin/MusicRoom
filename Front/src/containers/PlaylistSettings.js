import { connect } from 'react-redux';
import PlaylistSettings from '../screens/PlaylistSettings';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

export default connect(mapStateToProps, null)(PlaylistSettings);
