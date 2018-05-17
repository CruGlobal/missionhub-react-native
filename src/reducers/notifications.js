import { REQUESTS } from '../actions/api';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
  REQUEST_NOTIFICATIONS,
  LOAD_HOME_NOTIFICATION_REMINDER,
} from '../constants';

const initialState = {
  pushDevice: {},
  requestedNativePermissions: false,
  showReminderOnLoad: true,
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
    case LOAD_HOME_NOTIFICATION_REMINDER:
      return {
        ...state,
        showReminderOnLoad: false,
      };
    case DISABLE_WELCOME_NOTIFICATION:
      return {
        ...state,
        hasShownWelcomeNotification: true,
      };
    case LOGOUT:
      //persist requestedNativePermissions on logout because notifications will remain enabled/disabled on device
      return {
        ...initialState,
        requestedNativePermissions: state.requestedNativePermissions,
      };
    default:
      return state;
  }
}

export default notificationReducer;
