import uuidv4 from 'uuid/v4';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { AuthState } from '../reducers/auth';
import { Person } from '../reducers/people';
import { OnboardingState } from '../reducers/onboarding';
import { OrganizationsState } from '../reducers/organizations';
import {
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
} from '../constants';
import { rollbar } from '../utils/rollbar.config';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { getMe } from './person';
import { navigatePush, navigateToCommunity } from './navigation';
import { showReminderOnLoad } from './notifications';
import { trackActionWithoutData, updateAnalyticsContext } from './analytics';
import { joinCommunity } from './organizations';

export const SET_ONBOARDING_PERSON_ID = 'SET_ONBOARDING_PERSON_ID';
export const SET_ONBOARDING_COMMUNITY = 'SET_ONBOARDING_COMMUNITY_ID';
export const SKIP_ONBOARDING_ADD_PERSON = 'SKIP_ONBOARDING_ADD_PERSON';

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
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(updateAnalyticsContext({ 'cru.section-type': 'onboarding' }));
  dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_STARTED));
};

export function createMyPerson(firstName: string, lastName: string) {
  const data = {
    code: uuidv4(),
    first_name: firstName,
    last_name: lastName,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data));
    // @ts-ignore
    const me = ((await dispatch(getMe())) as unknown) as Person;

    rollbar.setPerson(me.id);

    dispatch({
      type: LOAD_PERSON_DETAILS,
      person: me,
    });

    return me;
  };
}

export const createPerson = (firstName: string, lastName: string) => async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, any>,
  getState: () => { auth: AuthState },
) => {
  const {
    person: { id: myId },
  } = getState().auth;
  const data = {
    data: {
      type: 'person',
      attributes: {
        first_name: firstName,
        last_name: lastName,
      },
    },
    included: [
      {
        type: 'contact_assignment',
        attributes: {
          assigned_to_id: myId,
        },
      },
    ],
  };

  const results = (await dispatch(
    callApi(REQUESTS.ADD_NEW_PERSON, {}, data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any;

  dispatch({
    type: LOAD_PERSON_DETAILS,
    person: results.response as Person,
  });

  return results;
};

const finalOnboardingActions = () => async (
  dispatch: ThunkDispatch<{}, null, AnyAction>,
) => {
  await dispatch(
    showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
  );
  dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));
  dispatch(updateAnalyticsContext({ 'cru.section-type': '' }));
  dispatch(navigatePush(CELEBRATION_SCREEN));
};

export const skipAddPersonAndCompleteOnboarding = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(skipOnboardingAddPerson());
  dispatch(finalOnboardingActions());
};

export const resetPersonAndCompleteOnboarding = () => (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
  dispatch(setOnboardingPersonId(''));
  dispatch(finalOnboardingActions());
};

export function joinStashedCommunity() {
  return async (
    dispatch: ThunkDispatch<{ auth: AuthState }, null, AnyAction>,
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
    dispatch(navigateToCommunity(getState().onboarding.community));
    dispatch(trackActionWithoutData(ACTIONS.SELECT_JOINED_COMMUNITY));
  };
}
