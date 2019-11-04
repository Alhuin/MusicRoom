import { connect } from 'react-redux';
import Radios from '../screens/Radios';

const mapStateToProps = state => ({
  loggedUser: state.authReducer.loggedUser,
});

// const mapDispatchToProps = dispatch => ({
//   changing: payload => dispatch(actions.isChanging(payload)),
//   setCurrentPosition: payload => dispatch(actions.setCurrentPosition(payload)),
//   paused: payload => dispatch(actions.paused(payload)),
//   setTotalLength: payload => dispatch(actions.setTotalLength(payload)),
//   changeTrack: payload => dispatch(actions.changeTrack(payload)),
// });

export default connect(mapStateToProps, null)(Radios);
