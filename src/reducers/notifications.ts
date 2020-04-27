import Config from 'react-native-config';

import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';
import { HAS_SHOWN_NOTIFICATION_PROMPT } from '../actions/notifications';

import { User } from './auth';

export interface PushDevice {
  id: string;
  token: string;
  platform: 'GCM' | typeof Config.APNS_MODE;
  user: User;
}

export interface NotificationsState {
  pushDevice: PushDevice | null;
  appHasShownPrompt: boolean;
}

const initialState: NotificationsState = {
  pushDevice: null,
  appHasShownPrompt: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    case HAS_SHOWN_NOTIFICATION_PROMPT:
      return {
        ...state,
        appHasShownPrompt: true,
      };
    case LOGOUT:
      //persist appHasShownPrompt on logout
      //because notifications will remain enabled/disabled on device      return {
      return {
        ...initialState,
        appHasShownPrompt: state.appHasShownPrompt,
      };
    default:
      return state;
  }
}

export default notificationReducer;
