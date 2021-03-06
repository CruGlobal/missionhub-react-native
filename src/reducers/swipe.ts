import {
  LOGOUT,
  GROUP_ONBOARDING_CARD,
  GROUP_INVITE_INFO,
  GROUP_TAB_SCROLL_ON_MOUNT,
} from '../constants';
import { exists } from '../utils/common';
import { GROUP_ONBOARDING_TYPES } from '../containers/Groups/OnboardingCard';

export interface SwipeState {
  journey: boolean;
  groupOnboarding: { [key in string]: boolean };
  groupInviteInfo: boolean;
  groupScrollToId: string | null;
}

const initialState: SwipeState = {
  journey: true,
  groupOnboarding: {
    [GROUP_ONBOARDING_TYPES.celebrate]: true,
    [GROUP_ONBOARDING_TYPES.challenges]: true,
    [GROUP_ONBOARDING_TYPES.impact]: true,
    [GROUP_ONBOARDING_TYPES.steps]: true,
  },
  groupInviteInfo: true,
  groupScrollToId: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function swipeReducer(state: SwipeState = initialState, action: any) {
  switch (action.type) {
    case GROUP_INVITE_INFO:
      return { ...state, groupInviteInfo: false };
    case GROUP_TAB_SCROLL_ON_MOUNT:
      return { ...state, groupScrollToId: action.value };
    case GROUP_ONBOARDING_CARD: {
      const target = action.target;
      if (!exists(state.groupOnboarding[target])) {
        return state;
      }
      return {
        ...state,
        groupOnboarding: { ...state.groupOnboarding, [target]: action.value },
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default swipeReducer;
