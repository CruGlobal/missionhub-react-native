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
import { buildTrackingObj } from '../utils/common';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { getMe } from './person';
import { navigatePush } from './navigation';
import { showReminderOnLoad } from './notifications';
import { trackActionWithoutData } from './analytics';
import { joinCommunity, navigateToCommunity } from './organizations';

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

export function createMyPerson(firstName: string, lastName: string) {
  const data = {
    code: uuidv4(),
    first_name: firstName,
    last_name: lastName,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data));
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

export function skipOnboardingComplete() {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));
    dispatch(skipOnboardingAddPerson());
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        trackingObj: buildTrackingObj('onboarding : complete', 'onboarding'),
      }),
    );
  };
}

export function skipOnboarding() {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    await dispatch(
      showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
    );

    return dispatch(skipOnboardingComplete());
  };
}

export function joinStashedCommunity() {
  return async (
    dispatch: ThunkDispatch<{ auth: AuthState }, null, AnyAction>,
    getState: () => {
      onboarding: OnboardingState;
    },
  ) => {
    const {
      onboarding: {
        community: { id, community_code, community_url },
      },
    } = getState();

    id && (await dispatch(joinCommunity(id, community_code, community_url)));
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
    dispatch(navigateToCommunity(getState().onboarding.community.id));
    dispatch(trackActionWithoutData(ACTIONS.SELECT_JOINED_COMMUNITY));
  };
}
