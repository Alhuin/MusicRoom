import { LOGGED, ADMIN, USER_CHANGED } from '../actions/types';

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  loggedUser: null,
};

const authReducer = (state = initialState, action) => {
  // console.log(action.type, action.payload);
  switch (action.type) {
    case LOGGED:
      return {
        ...state, isLoggedIn: action.payload,
      };
    case ADMIN:
      return {
        ...state, isAdmin: action.payload,
      };
    case USER_CHANGED:
      return {
        ...state, loggedUser: action.payload,
      };
    default:
      return state;
  }
};

// const store = createStore(playerStore);
export default authReducer;
