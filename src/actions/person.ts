/* eslint-disable max-lines */

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  UPDATE_PERSON_ATTRIBUTES,
  DELETE_PERSON,
  ACTIONS,
  LOAD_PERSON_DETAILS,
  ORG_PERMISSIONS,
} from '../constants';
import { exists } from '../utils/common';
import { REQUESTS } from '../api/routes';
import { apolloClient } from '../apolloClient';
import { STEPS_QUERY } from '../containers/StepsScreen/queries';
import { RootState } from '../reducers';
import {
  ME_PERSON_TABS,
  PERSON_TABS,
} from '../containers/PersonScreen/PersonTabs';
import { personSelector, contactAssignmentSelector } from '../selectors/people';
import { GET_PERSON } from '../containers/AddContactScreen/queries';
import { getAuthPerson } from '../auth/authUtilities';

import callApi from './api';
import { trackActionWithoutData } from './analytics';
import { navigatePush } from './navigation';
import { getMyCommunities } from './organizations';

export const getMe = (extraInclude?: string) => async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
) => {
  const personInclude =
    'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  const include = extraInclude
    ? `${personInclude},${extraInclude}`
    : personInclude;

  const { response: person } = await dispatch(
    callApi(REQUESTS.GET_ME, { include }),
  );

  return person;
};

// @ts-ignore
export function getPersonDetails(id) {
  const personInclude =
    'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  // @ts-ignore
  return async dispatch => {
    if (!id) {
      return Promise.reject(
        'Invalid Data from getPersonDetails: no personId passed in',
      );
    }

    const query = {
      person_id: id,
      include: personInclude,
    };
    const { response: person } = await dispatch(
      callApi(REQUESTS.GET_PERSON, query),
    );

    return dispatch({
      type: LOAD_PERSON_DETAILS,
      person,
    });
  };
}

// eslint-disable-next-line max-params
export function savePersonNote(
  personId: string,
  notes: string | undefined,
  noteId: string | null,
  myId: string,
) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!personId) {
      return Promise.reject(
        'Invalid Data from savePersonNote: no personId passed in',
      );
    }

    const bodyData = {
      data: {
        type: 'person_note',
        attributes: {
          content: notes || '',
        },
        relationships: {
          person: {
            data: {
              type: 'person',
              id: personId,
            },
          },
          user: {
            data: {
              type: 'user',
              id: myId,
            },
          },
        },
      },
    };

    if (!noteId) {
      dispatch(callApi(REQUESTS.ADD_PERSON_NOTE, {}, bodyData));
    }
    dispatch(callApi(REQUESTS.UPDATE_PERSON_NOTE, { noteId }, bodyData));
  };
}

export function getPersonNote(personId: string, myId: string) {
  // @ts-ignore
  return dispatch => {
    const query = { person_id: personId, include: 'person_notes' };

    // @ts-ignore
    return dispatch(callApi(REQUESTS.GET_PERSON_NOTE, query)).then(results => {
      const person = results.find('person', personId);
      if (person && person.person_notes) {
        const notes = person.person_notes;
        // @ts-ignore
        return notes.find(element => {
          return element.user_id == myId;
        });
      }
      return Promise.reject('Person Not Found in getPersonNote');
    });
  };
}

// @ts-ignore
export function updatePersonAttributes(personId, personAttributes) {
  return {
    type: UPDATE_PERSON_ATTRIBUTES,
    updatedPersonAttributes: {
      id: personId,
      ...personAttributes,
    },
  };
}

export function updatePerson(data: {
  id?: string;
  firstName?: string;
  lastName?: string;
  userGender?: string;
  emailId?: string;
  email?: string;
  phoneId?: string;
  phone?: string;
  orgPermission?: {
    id: string;
    permission_id?: string;
    archive_date?: string;
  };
}) {
  const personInclude =
    'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!(data && data.id)) {
      return dispatch({
        type: 'UPDATE_PERSON_FAIL',
        error: 'InvalidData',
        data,
      });
    }

    const updateData = { type: 'person' };
    let attributes;
    if (exists(data.firstName)) {
      attributes = { ...(attributes || {}), first_name: data.firstName };
    }
    if (exists(data.lastName)) {
      attributes = { ...(attributes || {}), last_name: data.lastName };
    }
    if (exists(data.userGender)) {
      attributes = { ...(attributes || {}), gender: data.userGender };
    }
    if (attributes) {
      // @ts-ignore
      updateData.attributes = attributes;
    }
    const bodyData = {
      data: updateData,
      ...(data.email || data.phone || data.orgPermission
        ? {
            included: [
              ...(data.email
                ? [
                    {
                      id: data.emailId,
                      type: 'email',
                      attributes: { email: data.email },
                    },
                  ]
                : []),
              ...(data.phone
                ? [
                    {
                      id: data.phoneId,
                      type: 'phone_number',
                      attributes: {
                        number: data.phone,
                      },
                    },
                  ]
                : []),
              ...(data.orgPermission && data.orgPermission.permission_id
                ? [
                    {
                      type: 'organizational_permission',
                      id: data.orgPermission.id,
                      attributes: {
                        permission_id: data.orgPermission.permission_id,
                      },
                    },
                  ]
                : []),
              ...(data.orgPermission && data.orgPermission.archive_date
                ? [
                    {
                      type: 'organizational_permission',
                      id: data.orgPermission.id,
                      attributes: {
                        archive_date: data.orgPermission.archive_date,
                      },
                    },
                  ]
                : []),
            ],
          }
        : {}),
    };
    const query = {
      personId: data.id,
      include: personInclude,
    };

    const results = await dispatch(
      callApi(REQUESTS.UPDATE_PERSON, query, bodyData),
    );
    const person = results.response;

    dispatch(
      updatePersonAttributes(data.id, {
        first_name: person.first_name,
        last_name: person.last_name,
        gender: person.gender,
        full_name: person.full_name,
        email_addresses: person.email_addresses,
        phone_numbers: person.phone_numbers,
        organizational_permissions: person.organizational_permissions,
      }),
    );

    return results;
  };
}

// @ts-ignore
export function makeAdmin(personId, orgPermissionId) {
  // @ts-ignore
  return async dispatch => {
    const results = await dispatch(
      updateOrgPermission(personId, orgPermissionId, ORG_PERMISSIONS.ADMIN),
    );
    dispatch(trackActionWithoutData(ACTIONS.MANAGE_MAKE_ADMIN));

    return results;
  };
}

// @ts-ignore
export function removeAsAdmin(personId, orgPermissionId) {
  // @ts-ignore
  return async dispatch => {
    const results = await dispatch(
      updateOrgPermission(personId, orgPermissionId, ORG_PERMISSIONS.USER),
    );
    dispatch(trackActionWithoutData(ACTIONS.MANAGE_REMOVE_ADMIN));

    return results;
  };
}

export function updateOrgPermission(
  // @ts-ignore
  personId,
  // @ts-ignore
  orgPermissionId,
  // @ts-ignore
  permissionLevel,
) {
  // @ts-ignore
  return dispatch => {
    const data = {
      id: personId,
      orgPermission: {
        id: orgPermissionId,
        permission_id: permissionLevel,
      },
    };
    return dispatch(updatePerson(data));
  };
}

// @ts-ignore
export function archiveOrgPermission(personId, orgPermissionId) {
  // @ts-ignore
  return async dispatch => {
    const results = await dispatch(
      updatePerson({
        id: personId,
        orgPermission: {
          id: orgPermissionId,
          archive_date: new Date().toISOString(),
        },
      }),
    );

    const myId = getAuthPerson().id;
    dispatch(
      trackActionWithoutData(
        personId === myId
          ? ACTIONS.MANAGE_LEAVE_COMMUNITY
          : ACTIONS.MANAGE_REMOVE_MEMBER,
      ),
    );
    dispatch(getMyCommunities());

    return results;
  };
}

export function deleteContactAssignment(personId: string) {
  return async (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => RootState,
  ) => {
    const person = personSelector(getState(), { personId });
    const { id: contactAssignmentId } =
      contactAssignmentSelector({ person }) || {};

    await dispatch(
      callApi(REQUESTS.DELETE_CONTACT_ASSIGNMENT, {
        contactAssignmentId,
      }),
    );

    apolloClient.query({ query: STEPS_QUERY });
    return dispatch({
      type: DELETE_PERSON,
      personId,
    });
  };
}

export function navToPersonScreen(personId: string) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const isMe = getAuthPerson().id === personId;

    dispatch(
      navigatePush(isMe ? ME_PERSON_TABS : PERSON_TABS, {
        personId,
      }),
    );
  };
}

export const updatePersonGQL = (id: string) =>
  apolloClient.query({ query: GET_PERSON, variables: { id } });
