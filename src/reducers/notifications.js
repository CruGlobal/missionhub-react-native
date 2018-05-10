import { REQUESTS } from '../actions/api';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION, ALLOW_NOTIFICATIONS,
} from '../constants';

const initialState = {
  pushDevice: {},
  hasAllowed: false,
  hasShownWelcomeNotification: false,
};

function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.SET_PUSH_TOKEN.SUCCESS:
      return {
        ...state,
        pushDevice: action.results.response,
      };
    case ALLOW_NOTIFICATIONS:
      return {
        ...state,
        hasAllowed: true,
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
