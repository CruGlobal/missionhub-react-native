import { REQUESTS } from '../actions/api';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
} from '../constants';

const initialState = {
  pushDevice: {},
  hasShownWelcomeNotification: false,
};

function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.SET_PUSH_TOKEN.SUCCESS:
      return {
        ...state,
        pushDevice: action.results.response,
      };
    case DISABLE_WELCOME_NOTIFICATION:
      return {
        ...state,
        hasShownWelcomeNotification: true,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default notificationReducer;
