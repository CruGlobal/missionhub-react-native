import {
  LOGOUT,
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
} from '../constants';

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState = {
  stepsHome: true,
  stepsContact: true,
  stepsReminder: false, // Never show on the reminders anymore
  journey: true,
};

function swipeReducer(state = initialState, action) {
  switch (action.type) {
    case SWIPE_REMINDER_STEPS_HOME:
      return { ...state, stepsHome: false };
    case SWIPE_REMINDER_STEPS_CONTACT:
      return { ...state, stepsContact: false };
    case SWIPE_REMINDER_STEPS_REMINDER:
      return { ...state, stepsReminder: false };
    case SWIPE_REMINDER_JOURNEY:
      return { ...state, journey: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default swipeReducer;
