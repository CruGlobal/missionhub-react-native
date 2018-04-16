import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';

import {
  LOGOUT,
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  PUSH_NOTIFICATION_REMINDER,
} from '../constants';
import { useFirstExists } from '../utils/common';

const initialState = {
  pushDevice: {},
  hasAsked: false,
  shouldAsk: true,
  showReminder: true,
};

function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.notifications;
      if (incoming) {
        return {
          ...initialState,
          pushDevice: useFirstExists(incoming.pushDevice, state.pushDevice),
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
      return {
        ...state,
        pushDevice: action.results.response,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default notificationReducer;
