import { LOGOUT, LogoutAction } from '../constants';
import {
  SET_ONBOARDING_PERSON_ID,
  SET_ONBOARDING_COMMUNITY,
  SKIP_ONBOARDING_ADD_PERSON,
  SetOnboardingPersonIdAction,
  SetOnboardingCommunityAction,
  SkipOnboardingAddPersonAction,
} from '../actions/onboarding';

export interface OnboardingState {
  personId: string;
  community: {
    id?: string;
    community_code: string;
    community_url: string;
  };
  skippedAddingPerson: boolean;
}

const initialState: OnboardingState = {
  personId: '',
  community: {
    id: undefined,
    community_code: '',
    community_url: '',
  },
  skippedAddingPerson: false,
};

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
