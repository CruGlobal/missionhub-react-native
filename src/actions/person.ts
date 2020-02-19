/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0, max-params: 0 */

import {
  CONTACT_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
} from '../containers/Groups/AssignedPersonScreen/';
import { UNASSIGNED_PERSON_SCREEN } from '../containers/Groups/UnassignedPersonScreen';
import {
  UPDATE_PERSON_ATTRIBUTES,
  DELETE_PERSON,
  ACTIONS,
  LOAD_PERSON_DETAILS,
  ORG_PERMISSIONS,
} from '../constants';
import { hasOrgPermissions, exists } from '../utils/common';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../selectors/people';
import { organizationSelector } from '../selectors/organizations';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { trackActionWithoutData } from './analytics';
import { navigatePush } from './navigation';
import { getMyCommunities } from './organizations';
import { getMySteps } from './steps';

// @ts-ignore
export function getMe(extraInclude) {
  const personInclude =
    'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  const include = extraInclude
    ? `${personInclude},${extraInclude}`
    : personInclude;

  // @ts-ignore
  return async dispatch => {
    const { response: person } = await dispatch(
      callApi(REQUESTS.GET_ME, { include }),
    );
    return person;
  };
}

// @ts-ignore
export function getPersonDetails(id, orgId) {
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
    const orgPermission =
      orgId &&
      (person.organizational_permissions || []).find(
        // @ts-ignore
        o => o.organization_id === orgId,
      );
    return dispatch({
      type: LOAD_PERSON_DETAILS,
      person,
      orgId,
      org: orgPermission && orgPermission.organization,
    });
  };
}

// @ts-ignore
export function savePersonNote(personId, notes, noteId, myId) {
  // @ts-ignore
  return dispatch => {
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
      return dispatch(callApi(REQUESTS.ADD_PERSON_NOTE, {}, bodyData));
    }
    return dispatch(callApi(REQUESTS.UPDATE_PERSON_NOTE, { noteId }, bodyData));
  };
}

// @ts-ignore
export function getPersonNote(personId, myId) {
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
export function getPersonJourneyDetails(id) {
  // @ts-ignore
  return dispatch => {
    const query = {
      person_id: id,
      include:
        'pathway_progression_audits.old_pathway_stage,pathway_progression_audits.new_pathway_stage,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
    };
    // @ts-ignore
    return dispatch(callApi(REQUESTS.GET_PERSON_JOURNEY, query));
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

// @ts-ignore
export function updatePerson(data) {
  const personInclude =
    'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  // @ts-ignore
  return async dispatch => {
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
    if (exists(data.gender)) {
      attributes = { ...(attributes || {}), gender: data.gender };
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
  return async (dispatch, getState) => {
    const results = await dispatch(
      updatePerson({
        id: personId,
        orgPermission: {
          id: orgPermissionId,
          archive_date: new Date().toISOString(),
        },
      }),
    );

    const myId = getState().auth.person.id;
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

// @ts-ignore
export function updateFollowupStatus(person, orgPermissionId, status) {
  // @ts-ignore
  return async dispatch => {
    const data = {
      data: {
        type: 'person',
      },
      included: [
        {
          id: orgPermissionId,
          type: 'organizational_permission',
          attributes: {
            followup_status: status,
          },
        },
      ],
    };
    await dispatch(
      callApi(REQUESTS.UPDATE_PERSON, { personId: person.id }, data),
    );

    dispatch(trackActionWithoutData(ACTIONS.STATUS_CHANGED));

    return dispatch(
      updatePersonAttributes(person.id, {
        organizational_permissions: person.organizational_permissions.map(
          // @ts-ignore
          orgPermission =>
            orgPermission.id === orgPermissionId
              ? { ...orgPermission, followup_status: status }
              : orgPermission,
        ),
      }),
    );
  };
}

export function createContactAssignment(
  // @ts-ignore
  organizationId,
  // @ts-ignore
  personAssignedToId,
  // @ts-ignore
  personReceiverId,
) {
  // @ts-ignore
  return async dispatch => {
    const data = {
      included: [
        {
          type: 'contact_assignment',
          attributes: {
            assigned_to_id: personAssignedToId,
            organization_id: organizationId,
          },
        },
      ],
    };
    await dispatch(
      callApi(REQUESTS.UPDATE_PERSON, { personId: personReceiverId }, data),
    );
    dispatch(trackActionWithoutData(ACTIONS.ASSIGNED_TO_ME));
    return dispatch(getPersonDetails(personReceiverId, organizationId));
  };
}

// @ts-ignore
export function deleteContactAssignment(id, personId, personOrgId, note = '') {
  // @ts-ignore
  return async dispatch => {
    const data = {
      data: {
        type: 'contact_assignment',
        attributes: {
          unassignment_reason: note,
        },
      },
    };

    await dispatch(
      callApi(
        REQUESTS.DELETE_CONTACT_ASSIGNMENT,
        { contactAssignmentId: id },
        data,
      ),
    );

    dispatch(getMySteps());
    return dispatch({
      type: DELETE_PERSON,
      personId,
      personOrgId,
    });
  };
}

// @ts-ignore
export function navToPersonScreen(person, org, props = {}) {
  // @ts-ignore
  return (dispatch, getState) => {
    const organization = org ? org : {};
    const { auth, people, organizations } = getState();
    const orgId = organization.id;
    const personId = person.id;

    const selectorOrg =
      organizationSelector({ organizations }, { orgId }) || organization;
    //TODO Creating a new object every time will cause shallow comparisons to fail and lead to unnecessary re-rendering

    const selectorPerson =
      personSelector({ people }, { orgId, personId }) || person;

    const contactAssignment = contactAssignmentSelector(
      { auth },
      { person: selectorPerson, orgId },
    );
    const authPerson = auth.person;

    dispatch(
      navigatePush(
        getPersonScreenRoute(
          authPerson,
          selectorPerson,
          selectorOrg,
          contactAssignment,
        ),
        {
          ...props,
          person: selectorPerson,
          organization: selectorOrg,
        },
      ),
    );
  };
}

export function getPersonScreenRoute(
  // @ts-ignore
  mePerson,
  // @ts-ignore
  person,
  // @ts-ignore
  organization,
  // @ts-ignore
  contactAssignment,
) {
  const isMe = person.id === mePerson.id;

  const isMember = hasOrgPermissions(
    orgPermissionSelector(
      {},
      {
        person: person,
        organization,
      },
    ),
  );

  const isUserCreatedOrg = organization.user_created;
  const isGroups = mePerson.user.groups_feature;

  if (isMe) {
    if (isMember) {
      if (isGroups) {
        return IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN;
      }

      return ME_COMMUNITY_PERSON_SCREEN;
    }

    return ME_PERSONAL_PERSON_SCREEN;
  }

  if (isMember) {
    if (isUserCreatedOrg) {
      return IS_USER_CREATED_MEMBER_PERSON_SCREEN;
    }
    if (isGroups) {
      return IS_GROUPS_MEMBER_PERSON_SCREEN;
    }

    return MEMBER_PERSON_SCREEN;
  }

  if (contactAssignment) {
    return CONTACT_PERSON_SCREEN;
  }

  return UNASSIGNED_PERSON_SCREEN;
}
