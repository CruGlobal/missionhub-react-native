import { checkForUnreadComments } from '../actions/unreadComments';
import {
  NAVIGATE_FORWARD,
  STEPS_TAB,
  PEOPLE_TAB,
  GROUPS_TAB,
  TRACK_TAB,
} from '../constants';

export default function misc({ dispatch }) {
  return next => action => {
    const returnValue = next(action);

    switch (action.type) {
      case NAVIGATE_FORWARD:
      case TRACK_TAB:
        checkUnreadCommentsNotification(action, dispatch);
        break;
    }

    return returnValue;
  };
}

function checkUnreadCommentsNotification(action, dispatch) {
  if (
    action.routeName === STEPS_TAB ||
    action.routeName === PEOPLE_TAB ||
    action.routeName === GROUPS_TAB
  ) {
    dispatch(checkForUnreadComments());
  }
}
