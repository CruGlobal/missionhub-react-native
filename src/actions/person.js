import {
  CONTACT_PERSON_SCREEN,
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
} from '../constants';
import { isMemberForOrg, exists } from '../utils/common';
import {
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../selectors/people';

import callApi, { REQUESTS } from './api';
import { trackActionWithoutData } from './analytics';
import { navigatePush } from './navigation';

export function getMe(extraInclude) {
  const personInclude =
    'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  const include = extraInclude
    ? `${personInclude},${extraInclude}`
    : personInclude;

  return async dispatch => {
    const { response: person } = await dispatch(
      callApi(REQUESTS.GET_ME, { include }),
    );
    return person;
  };
}

export function getPersonDetails(id, orgId) {
  const personInclude =
    'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  return async dispatch => {
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

export function savePersonNote(personId, notes, noteId, myId) {
  return dispatch => {
    if (!personId) {
      return Promise.reject('InvalidData');
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

export function getPersonNote(personId, myId) {
  return async dispatch => {
    const query = { person_id: personId, include: 'person_notes' };

    return await dispatch(callApi(REQUESTS.GET_PERSON_NOTE, query)).then(
      results => {
        const person = results.find('person', personId);
        if (person && person.person_notes) {
          const notes = person.person_notes;
          return notes.find(element => {
            return element.user_id == myId;
          });
        }
        return Promise.reject('PersonNotFound');
      },
    );
  };
}

export function getPersonJourneyDetails(id) {
  return dispatch => {
    const query = {
      person_id: id,
      include:
        'pathway_progression_audits.old_pathway_stage,pathway_progression_audits.new_pathway_stage,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
    };
    return dispatch(callApi(REQUESTS.GET_PERSON_JOURNEY, query));
  };
}

export function updatePersonAttributes(personId, personAttributes) {
  return {
    type: UPDATE_PERSON_ATTRIBUTES,
    updatedPersonAttributes: {
      id: personId,
      ...personAttributes,
    },
  };
}

export function updatePerson(data) {
  const personInclude =
    'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

  return async dispatch => {
    if (!data) {
      return dispatch({
        type: 'UPDATE_PERSON_FAIL',
        error: 'InvalidData',
        data,
      });
    }

    let updateData = { type: 'person' };
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
              ...(data.orgPermission
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

export function updateFollowupStatus(person, orgPermissionId, status) {
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
  organizationId,
  personAssignedToId,
  personReceiverId,
) {
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
    return dispatch(getPersonDetails(personReceiverId, organizationId));
  };
}

export function deleteContactAssignment(id, personId, personOrgId, note = '') {
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
    return dispatch({
      type: DELETE_PERSON,
      personId,
      personOrgId,
    });
  };
}

export function navToPersonScreen(person, org) {
  return (dispatch, getState) => {
    const organization = org ? org : {};
    //TODO Creating a new object every time will cause shallow comparisons to fail and lead to unnecessary re-rendering

    const auth = getState().auth;
    const contactAssignment = contactAssignmentSelector(
      { auth },
      { person, orgId: organization.id },
    );
    const isMember = isMemberForOrg(
      orgPermissionSelector(null, {
        person,
        organization: { id: organization.id },
      }),
    );
    const authPerson = auth.person;
    const isMe = person.id === authPerson.id;
    const isGroups = authPerson.user.groups_feature;

    dispatch(
      navigatePush(getNextScreen(isMe, isMember, isGroups, contactAssignment), {
        person,
        organization,
      }),
    );
  };

  function getNextScreen(isMe, isMember, isGroups, contactAssignment) {
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
}
