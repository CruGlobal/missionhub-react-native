import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';

import {
  LOGOUT,
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
  PUSH_NOTIFICATION_REMINDER,
} from '../constants';
import { useFirstExists } from '../utils/common';

const initialAuthState = {
  token: '',
  hasAsked: false,
  shouldAsk: true,
  showReminder: true,
  isRegistered: false,
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
          isRegistered: useFirstExists(incoming.isRegistered, state.isRegistered),
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
    case PUSH_NOTIFICATION_SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case REQUESTS.SET_PUSH_TOKEN.SUCCESS:
      return {
        ...state,
        isRegistered: true,
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}

export default notificationReducer;
