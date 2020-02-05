import { connect } from 'react-redux';

import AddFloatingButton from '../components/AddFloatingButton';

const mapStateToProps = state => ({
  playerOpen: state.playerReducer.playerOpen,
});

export default connect(mapStateToProps, null)(AddFloatingButton);
