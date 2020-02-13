import { ADMIN, USER_CHANGED, LOG_PASS_LOGIN } from '../actions/types';

const initialState = {
  isAdmin: false,
  loggedUser: null,
  tmpLogUser: null,
};

const authReducer = (state = initialState, action) => {
  // console.log(action.type, action.payload);
  switch (action.type) {
    // TODO Check isAdmin nécessaire
    case ADMIN:
      return {
        ...state, isAdmin: action.payload,
      };
    case USER_CHANGED:
      return {
        ...state, loggedUser: action.payload,
      };
    case LOG_PASS_LOGIN:
      return {
        ...state, tmpLogUser: action.payload,
      };
    default:
      return state;
  }
};

// const store = createStore(playerStore);
export default authReducer;
