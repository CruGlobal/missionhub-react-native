import { LOGOUT, LogoutAction } from '../constants';
import {
  SET_ONBOARDING_PERSON_ID,
  SET_ONBOARDING_COMMUNITY,
  SKIP_ONBOARDING_ADD_PERSON,
  SetOnboardingPersonIdAction,
  SetOnboardingCommunityAction,
  SkipOnboardingAddPersonAction,
} from '../actions/onboarding';

const initialState = {
  personId: '',
  community: {
    id: '',
    community_code: '',
    community_url: '',
  },
  skippedAddingPerson: false,
};

export type OnboardingState = typeof initialState;

type OnboardingActionTypes =
  | SetOnboardingPersonIdAction
  | SetOnboardingCommunityAction
  | SkipOnboardingAddPersonAction
  | LogoutAction;

export const onboardingReducer = (
  state: OnboardingState = initialState,
  action: OnboardingActionTypes,
) => {
  switch (action.type) {
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