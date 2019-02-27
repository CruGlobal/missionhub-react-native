/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import {
  LOGOUT,
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
  GROUP_ONBOARDING_CARD,
  GROUP_INVITE_INFO,
  GROUP_TAB_SCROLL_ON_MOUNT,
  SET_COMPLETE_STEP_EXTRA_BACK,
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
  groupScrollToId: null,
  completeStepExtraBack: false,
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
    case GROUP_TAB_SCROLL_ON_MOUNT:
      return { ...state, groupScrollToId: action.value };
    case GROUP_ONBOARDING_CARD:
      const target = action.target;
      if (!exists(state.groupOnboarding[target])) {
        return state;
      }
      return {
        ...state,
        groupOnboarding: { ...state.groupOnboarding, [target]: action.value },
      };
    case SET_COMPLETE_STEP_EXTRA_BACK:
      return { ...state, completeStepExtraBack: action.value };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default swipeReducer;
