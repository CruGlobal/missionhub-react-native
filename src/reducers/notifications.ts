import Config from 'react-native-config';

import { REQUESTS } from '../api/routes';
import {
  LOGOUT,
  DISABLE_WELCOME_NOTIFICATION,
  REQUEST_NOTIFICATIONS,
  LOAD_HOME_NOTIFICATION_REMINDER,
} from '../constants';

import { User } from './auth';

interface PushDevice {
  id: string;
  token: string;
  platform: 'GCM' | typeof Config.APNS_MODE;
  user: User;
}

export interface NotificationsState {
  pushDevice: PushDevice | null;
  requestedNativePermissions: boolean;
  showReminderOnLoad: boolean;
  hasShownWelcomeNotification: boolean;
  userHasAcceptedNotifications: boolean;
}

const initialState: NotificationsState = {
  pushDevice: null,
  requestedNativePermissions: false,
  showReminderOnLoad: true,
  hasShownWelcomeNotification: false,
  userHasAcceptedNotifications: false,
};

function notificationReducer(state = initialState, action: any) {
  switch (action.type) {
    case REQUESTS.SET_PUSH_TOKEN.SUCCESS:
      return {
        ...state,
        pushDevice: action.results.response,
      };
    case REQUESTS.DELETE_PUSH_TOKEN.SUCCESS:
      return {
        ...state,
        pushDevice: null,
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
