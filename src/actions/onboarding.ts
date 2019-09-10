import uuidv4 from 'uuid/v4';

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
import { updatePerson } from './person';
import { navigatePush, navigateReset } from './navigation';
import { showReminderOnLoad } from './notifications';
import { trackActionWithoutData } from './analytics';
import { joinCommunity } from './organizations';
import { AuthState } from 'src/reducers/auth';

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

/*
A user is considered to have completed onboarding once they've:
1) selected a stage for themselves, and
2) selected a stage for a contact assignment
 */
export function completeOnboarding() {
  return { type: COMPLETE_ONBOARDING };
}

export function firstNameChanged(firstName) {
  return {
    type: FIRST_NAME_CHANGED,
    firstName: firstName,
  };
}

export function lastNameChanged(lastName) {
  return {
    type: LAST_NAME_CHANGED,
    lastName: lastName,
  };
}

export function createMyPerson(firstName, lastName) {
  const data = {
    code: uuidv4(),
    first_name: firstName,
    last_name: lastName,
  };

  return async dispatch => {
    const me = await dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data));

    rollbar.setPerson(me.person_id);

    dispatch({
      type: LOAD_PERSON_DETAILS,
      person: {
        type: 'person',
        id: me.person_id,
        first_name: me.first_name,
        last_name: me.last_name,
      },
    });

    return me;
  };
}

export function personFirstNameChanged(firstName) {
  return {
    type: PERSON_FIRST_NAME_CHANGED,
    personFirstName: firstName,
  };
}

export function personLastNameChanged(lastName) {
  return {
    type: PERSON_LAST_NAME_CHANGED,
    personLastName: lastName,
  };
}

export function createPerson(firstName, lastName, myId) {
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

  return async dispatch => {
    const results = await dispatch(callApi(REQUESTS.ADD_NEW_PERSON, {}, data));

    dispatch({
      type: LOAD_PERSON_DETAILS,
      person: results.response,
    });

    return results;
  };
}

export function updateOnboardingPerson(data) {
  return dispatch => {
    return dispatch(updatePerson(data)).then(r => {
      dispatch({ type: UPDATE_ONBOARDING_PERSON, results: r });
      return r;
    });
  };
}

export function resetPerson() {
  return { type: RESET_ONBOARDING_PERSON };
}

export function stashCommunityToJoin({ community }) {
  return { type: STASH_COMMUNITY_TO_JOIN, community };
}

export function skipOnboardingComplete() {
  return dispatch => {
    dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));
    dispatch(completeOnboarding());
    dispatch(
      navigatePush(CELEBRATION_SCREEN, {
        trackingObj: buildTrackingObj('onboarding : complete', 'onboarding'),
      }),
    );
  };
}

export function skipOnboarding() {
  return async dispatch => {
    await dispatch(
      showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
    );

    return dispatch(skipOnboardingComplete());
  };
}

export function joinStashedCommunity() {
  return async (dispatch, getState) => {
    const { community } = getState().profile;
    await dispatch(
      joinCommunity(
        community.id,
        community.community_code,
        community.community_url,
      ),
    );
  };
}

export function landOnStashedCommunityScreen() {
  return (dispatch, getState) => {
    const { community } = getState().profile;
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
