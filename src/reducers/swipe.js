import {
  LOGOUT,
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
  GROUP_ONBOARDING_CARD,
  GROUP_INVITE_INFO,
} from '../constants';
import { exists } from '../utils/common';
import { GROUP_ONBOARDING_TYPES } from '../containers/Groups/OnboardingCard';

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState = {
  stepsHome: true,
  stepsContact: true,
  stepsReminder: false, // Never show on the reminders anymore
  journey: true,
  groupOnboarding: {
    [GROUP_ONBOARDING_TYPES.celebrate]: true,
    [GROUP_ONBOARDING_TYPES.challenges]: true,
    [GROUP_ONBOARDING_TYPES.members]: true,
    [GROUP_ONBOARDING_TYPES.impact]: true,
    [GROUP_ONBOARDING_TYPES.contacts]: true,
    [GROUP_ONBOARDING_TYPES.surveys]: true,
  },
  groupInviteInfo: true,
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
    case GROUP_INVITE_INFO:
      return { ...state, groupInviteInfo: false };
    case GROUP_ONBOARDING_CARD:
      const target = action.target;
      if (!exists(state.groupOnboarding[target])) {
        return state;
      }
      return {
        ...state,
        groupOnboarding: { ...state.groupOnboarding, [target]: action.value },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default swipeReducer;
