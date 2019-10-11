import { LOGOUT, LogoutAction } from '../constants';
import {
  SET_ONBOARDING_PERSON_ID,
  SET_ONBOARDING_COMMUNITY_ID,
  SKIP_ONBOARDING_ADD_PERSON,
  SetOnboardingPersonIdAction,
  SetOnboardingCommunityIdAction,
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
  | SetOnboardingCommunityIdAction
  | SkipOnboardingAddPersonAction
  | LogoutAction;

export const onboardingReducer = (
  state: OnboardingState = initialState,
  action: OnboardingActionTypes,
) => {
  switch (action.type) {
    case SET_ONBOARDING_PERSON_ID:
      return { ...state, personId: action.personId };
    case SET_ONBOARDING_COMMUNITY_ID:
      return {
        ...state,
        communityId: action.communityId,
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
