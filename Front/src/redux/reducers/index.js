import { combineReducers } from 'redux';

// Imports: Reducers
import authReducer from './authReducer';
import playerReducer from './playerReducer';

// Combine reducers
const appReducer = combineReducers({
  authReducer,
  playerReducer,
});

// const initialState = appReducer({}, {});

// Catch logOut action to reinitialise state
const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === 'LOG_OUT') {
    newState = undefined;
  }
  return appReducer(newState, action);
};

export default rootReducer;
