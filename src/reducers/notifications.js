import { REHYDRATE } from 'redux-persist/constants';

import {
  LOGOUT,
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_SET_TOKEN,
} from '../constants';
import { useFirstExists } from '../utils/common';

const initialAuthState = {
  token: '',
  hasAsked: false,
  shouldAsk: true,
};

function notificationReducer(state = initialAuthState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.notifications;
      if (incoming) {
        return {
          token: useFirstExists(incoming.token, state.token),
          hasAsked: useFirstExists(incoming.hasAsked, state.hasAsked),
          shouldAsk: useFirstExists(incoming.shouldAsk, state.shouldAsk),
        };
      }
      return state;
    case PUSH_NOTIFICATION_SHOULD_ASK:
      return {
        ...state,
        shouldAsk: action.bool,
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
    case LOGOUT:
      return {
        ...state,
        shouldAsk: true,
        token: '',
      };
    default:
      return state;
  }
}

export default notificationReducer;
