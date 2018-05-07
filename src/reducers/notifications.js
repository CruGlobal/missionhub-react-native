import { REQUESTS } from '../actions/api';

import {
  LOGOUT,
  PUSH_NOTIFICATION_ASKED,
  PUSH_NOTIFICATION_SHOULD_ASK,
  DISABLE_WELCOME_NOTIFICATION,
} from '../constants';

const initialState = {
  pushDevice: {},
  hasAsked: false,
  shouldAsk: true,
  hasShownWelcomeNotification: false,
};

function notificationReducer(state = initialState, action) {
  switch (action.type) {
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
