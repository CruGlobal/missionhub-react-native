import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { OnboardingState } from '../reducers/onboarding';
import { OrganizationsState } from '../reducers/organizations';
import { ACTIONS, NOTIFICATION_PROMPT_TYPES } from '../constants';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { COMMUNITY_TABS } from '../containers/Communities/Community/constants';
import { RootState } from '../reducers';

import { navigatePush } from './navigation';
import { checkNotifications } from './notifications';
import { trackActionWithoutData } from './analytics';
import { joinCommunity } from './organizations';

export const START_ONBOARDING = 'START_ONBOARDING';
export const FINISH_ONBOARDING = 'FINISH_ONBOARDING';
export const SET_ONBOARDING_PERSON_ID = 'SET_ONBOARDING_PERSON_ID';
export const SET_ONBOARDING_COMMUNITY = 'SET_ONBOARDING_COMMUNITY_ID';
export const SKIP_ONBOARDING_ADD_PERSON = 'SKIP_ONBOARDING_ADD_PERSON';

export interface StartOnboardingAction {
  type: typeof START_ONBOARDING;
}

export interface FinishOnboardingAction {
  type: typeof FINISH_ONBOARDING;
}

export interface SetOnboardingPersonIdAction {
  type: typeof SET_ONBOARDING_PERSON_ID;
  personId: string;
}

export interface SetOnboardingCommunityAction {
  type: typeof SET_ONBOARDING_COMMUNITY;
  community: {
    id: string;
    community_code: string;
    community_url: string;
  };
}

export interface SkipOnboardingAddPersonAction {
  type: typeof SKIP_ONBOARDING_ADD_PERSON;
}

export const setOnboardingPersonId = (
  personId: string,
): SetOnboardingPersonIdAction => ({
  type: SET_ONBOARDING_PERSON_ID,
  personId,
});

export const setOnboardingCommunity = (community: {
  id: string;
  community_code: string;
  community_url: string;
}): SetOnboardingCommunityAction => ({
  type: SET_ONBOARDING_COMMUNITY,
  community,
});

export const skipOnboardingAddPerson = (): SkipOnboardingAddPersonAction => ({
  type: SKIP_ONBOARDING_ADD_PERSON,
});

export const startOnboarding = () => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
  dispatch({ type: START_ONBOARDING });
};

export const skipAddPersonAndCompleteOnboarding = () => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  dispatch(skipOnboardingAddPerson());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch<any>(
    checkNotifications(NOTIFICATION_PROMPT_TYPES.ONBOARDING, () =>
      dispatch(navigatePush(CELEBRATION_SCREEN)),
    ),
  );
};

export const resetPersonAndCompleteOnboarding = () => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  dispatch(setOnboardingPersonId(''));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch<any>(
    checkNotifications(NOTIFICATION_PROMPT_TYPES.ONBOARDING, () =>
      dispatch(navigatePush(CELEBRATION_SCREEN)),
    ),
  );
};

export function joinStashedCommunity() {
  return async (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => {
      onboarding: OnboardingState;
    },
  ) => {
    const {
      onboarding: { community },
    } = getState();

    community &&
      (await dispatch(
        joinCommunity(
          community.id,
          community.community_code,
          community.community_url,
        ),
      ));
  };
}

export function landOnStashedCommunityScreen() {
  return (
    dispatch: ThunkDispatch<
      { organizations: OrganizationsState },
      null,
      AnyAction
    >,
    getState: () => { onboarding: OnboardingState },
  ) => {
    dispatch(
      navigatePush(COMMUNITY_TABS, {
        communityId: getState().onboarding.community?.id,
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.SELECT_JOINED_COMMUNITY));
  };
}
