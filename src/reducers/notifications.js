import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';

import {
  LOGOUT,
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_REMINDER,
} from '../constants';
import { useFirstExists } from '../utils/common';

const initialAuthState = {
  token: '',
  hasAsked: false,
  shouldAsk: true,
  showReminder: true,
  pushDeviceId: '',
};

function notificationReducer(state = initialAuthState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.notifications;
      if (incoming) {
        return {
          ...initialAuthState,
          token: useFirstExists(incoming.token, state.token),
          hasAsked: useFirstExists(incoming.hasAsked, state.hasAsked),
          shouldAsk: useFirstExists(incoming.shouldAsk, state.shouldAsk),
          showReminder: useFirstExists(incoming.showReminder, state.showReminder),
        };
      }
      return state;
    case PUSH_NOTIFICATION_SHOULD_ASK:
      return {
        ...state,
        shouldAsk: action.bool,
      };
    case PUSH_NOTIFICATION_REMINDER:
      return {
        ...state,
        showReminder: action.bool,
      };
    case PUSH_NOTIFICATION_ASKED:
      return {
        ...state,
        hasAsked: true,
      };
    case REQUESTS.SET_PUSH_TOKEN.SUCCESS:
      const deviceToken = action.results.findAll('push_notification_device_token')[0] || {};
      return {
        ...state,
        pushDeviceId: deviceToken.id,
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}

export default notificationReducer;
