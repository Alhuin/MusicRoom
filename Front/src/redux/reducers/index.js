import { combineReducers } from 'redux';

// Imports: Reducers
import authReducer from './authReducer';
import playerReducer from './playerReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  authReducer,
  playerReducer,
});

export default rootReducer;
