import { LOGOUT, LogoutAction } from '../constants';
import {
  START_ONBOARDING,
  FINISH_ONBOARDING,
  SET_ONBOARDING_PERSON_ID,
  SET_ONBOARDING_COMMUNITY,
  SKIP_ONBOARDING_ADD_PERSON,
  SetOnboardingPersonIdAction,
  SetOnboardingCommunityAction,
  SkipOnboardingAddPersonAction,
  StartOnboardingAction,
  FinishOnboardingAction,
} from '../actions/onboarding';

export interface OnboardingState {
  currentlyInOnboarding: boolean;
  personId: string;
  community: {
    id: string;
    community_code: string;
    community_url: string;
  } | null;
  skippedAddingPerson: boolean;
}

const initialState: OnboardingState = {
  currentlyInOnboarding: false,
  personId: '',
  community: null,
  skippedAddingPerson: false,
};

type OnboardingActionTypes =
  | StartOnboardingAction
  | FinishOnboardingAction
  | SetOnboardingPersonIdAction
  | SetOnboardingCommunityAction
  | SkipOnboardingAddPersonAction
  | LogoutAction;

export const onboardingReducer = (
  state: OnboardingState = initialState,
  action: OnboardingActionTypes,
) => {
  switch (action.type) {
    case START_ONBOARDING:
      return { ...state, currentlyInOnboarding: true };
    case FINISH_ONBOARDING:
      return { ...state, currentlyInOnboarding: false };
    case SET_ONBOARDING_PERSON_ID:
      return { ...state, personId: action.personId };
    case SET_ONBOARDING_COMMUNITY:
      return {
        ...state,
        community: action.community,
      };
    case SKIP_ONBOARDING_ADD_PERSON:
      return {
        ...state,
        skippedAddingPerson: true,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
