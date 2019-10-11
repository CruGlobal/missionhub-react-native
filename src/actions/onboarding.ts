import uuidv4 from 'uuid/v4';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { AuthState } from 'src/reducers/auth';
import { AuthState } from 'src/reducers/auth';
import { Person } from 'src/reducers/people';
import { organizationSelector } from 'src/selectors/organizations';
import { OnboardingState } from 'src/reducers/onboarding';
import { OrganizationsState } from 'src/reducers/organizations';

import {
  COMPLETE_ONBOARDING,
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  PERSON_FIRST_NAME_CHANGED,
  PERSON_LAST_NAME_CHANGED,
  RESET_ONBOARDING_PERSON,
  STASH_COMMUNITY_TO_JOIN,
  UPDATE_ONBOARDING_PERSON,
  ACTIONS,
  NOTIFICATION_PROMPT_TYPES,
  LOAD_PERSON_DETAILS,
} from '../constants';
import { rollbar } from '../utils/rollbar.config';
import { buildTrackingObj } from '../utils/common';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import {
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
} from '../containers/Groups/GroupScreen';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { updatePerson, getMe } from './person';
import { navigatePush, navigateReset } from './navigation';
import { showReminderOnLoad } from './notifications';
import { trackActionWithoutData } from './analytics';
import { joinCommunity } from './organizations';

export const SET_ONBOARDING_PERSON_ID = 'SET_ONBOARDING_PERSON_ID';
export const SET_ONBOARDING_COMMUNITY_ID = 'SET_ONBOARDING_COMMUNITY_ID';
export const SKIP_ONBOARDING_ADD_PERSON = 'SKIP_ONBOARDING_ADD_PERSON';

export interface SetOnboardingPersonIdAction {
  type: typeof SET_ONBOARDING_PERSON_ID;
  personId: string;
}

export interface SetOnboardingCommunityIdAction {
  type: typeof SET_ONBOARDING_COMMUNITY_ID;
  communityId: string;
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

export const setOnboardingCommunityId = (
  communityId: string,
): SetOnboardingCommunityIdAction => ({
  type: SET_ONBOARDING_COMMUNITY_ID,
  communityId,
});

export const skipOnbardingAddPerson = (): SkipOnboardingAddPersonAction => ({
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

export function updateOnboardingPerson(data: Person) {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dispatch(updatePerson(data)).then((r: any) => {
      dispatch({
        type: UPDATE_ONBOARDING_PERSON,
        results: r,
      });
      return r;
    });
  };
}

export function skipOnboardingComplete() {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));
    dispatch(skipOnbardingAddPerson());
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
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => {
      onboarding: OnboardingState;
      organizations: OrganizationsState;
    },
  ) => {
    const {
      organizations,
      onboarding: { communityId },
    } = getState();
    const community = organizationSelector(
      { organizations },
      { orgId: communityId },
    );
    await dispatch(
      joinCommunity(
        communityId,
        community.communityCode,
        community.communityUrl,
      ),
    );
  };
}

export function landOnStashedCommunityScreen() {
  return (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => {
      onboarding: OnboardingState;
      organizations: OrganizationsState;
    },
  ) => {
    const {
      organizations,
      onboarding: {
        community: { id },
      },
    } = getState();
    const community = organizationSelector({ organizations }, { orgId: id });
    dispatch(
      navigateReset(
        community.user_created ? USER_CREATED_GROUP_SCREEN : GROUP_SCREEN,
        {
          organization: community,
        },
      ),
    );
    dispatch(trackActionWithoutData(ACTIONS.SELECT_JOINED_COMMUNITY));
  };
}
