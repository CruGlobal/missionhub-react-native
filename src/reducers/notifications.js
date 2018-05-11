import { REQUESTS } from '../actions/api';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
  REQUEST_NOTIFICATIONS,
} from '../constants';

const initialState = {
  pushDevice: {},
  requestedNativePermissions: false,
  hasShownWelcomeNotification: false,
};

function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.SET_PUSH_TOKEN.SUCCESS:
      return {
        ...state,
        pushDevice: action.results.response,
      };
    case REQUEST_NOTIFICATIONS:
      return {
        ...state,
        requestedNativePermissions: true,
      };
    case DISABLE_WELCOME_NOTIFICATION:
      return {
        ...state,
        hasShownWelcomeNotification: true,
      };
    case LOGOUT:
      return {
        ...initialState,
        requestedNativePermissions: state.requestedNativePermissions,
      };
    default:
      return state;
  }
}

export default notificationReducer;
