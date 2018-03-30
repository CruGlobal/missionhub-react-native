import callApi, { REQUESTS } from './api';
import { UPDATE_PERSON_ATTRIBUTES, DELETE_PERSON, ACTIONS, LOAD_PERSON_DETAILS } from '../constants';
import { trackAction } from './analytics';

const personInclude = 'email_addresses,phone_numbers,organizational_permissions,reverse_contact_assignments,user';

export function getMe() {
  return async(dispatch) => {
    const { response: person } = await dispatch(callApi(REQUESTS.GET_ME, { include: personInclude }));
    return person;
  };
}

export function getPerson(id) {
  return (dispatch) => dispatch(callApi(REQUESTS.GET_PERSON, { person_id: id, include: `${personInclude},contact_assignments` }));
}

export function getPersonDetails(id, orgId) {
  return async(dispatch) => {
    const query = {
      person_id: id,
      include: personInclude,
    };
    const { response: person } = await dispatch(callApi(REQUESTS.GET_PERSON, query));
    return dispatch({
      type: LOAD_PERSON_DETAILS,
      person,
      orgId,
    });
  };
}

export function savePersonNote(personId, notes, noteId, myId) {
  return (dispatch) => {
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
  return async(dispatch) => {
    const query = { person_id: personId, include: 'person_notes' };

    return await dispatch(callApi(REQUESTS.GET_PERSON_NOTE, query)).then((results) => {
      const person = results.find('person', personId);
      if (person && person.person_notes) {
        const notes = person.person_notes;
        return notes.find((element) => { return element.user_id == myId; });
      }
      return Promise.reject('PersonNotFound');
    });
  };
}

export function getPersonJourneyDetails(id) {
  return (dispatch) => {
    const query = {
      person_id: id,
      include: 'pathway_progression_audits.old_pathway_stage,pathway_progression_audits.new_pathway_stage,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
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
    } };
}

export function updatePerson(data) {
  return async(dispatch) => {
    if (!data || !data.firstName) {
      return dispatch({ type: 'UPDATE_PERSON_FAIL', error: 'InvalidData', data });
    }
    const bodyData = {
      data: {
        type: 'person',
        attributes: {
          first_name: data.firstName,
          last_name: data.lastName,
          gender: data.gender,
        },
      },
      ...data.email || data.phone ? {
        included: [
          ...data.email ? [ {
            id: data.emailId,
            type: 'email',
            attributes: { email: data.email },
          } ] : [],
          ...data.phone ? [ {
            id: data.phoneId,
            type: 'phone_number',
            attributes: {
              number: data.phone,
            },
          } ] : [],
        ],
      } : {},
    };
    const query = {
      personId: data.id,
      include: 'email_addresses,phone_numbers',
    };
    const results = await dispatch(callApi(REQUESTS.UPDATE_PERSON, query, bodyData));
    const person = results.response;

    dispatch(updatePersonAttributes(data.id, {
      first_name: person.first_name,
      last_name: person.last_name,
      gender: person.gender,
      full_name: person.full_name,
      email_addresses: person.email_addresses,
      phone_numbers: person.phone_numbers,
    }));

    return results;
  };
}

export function updateFollowupStatus(person, orgPermissionId, status) {
  return async(dispatch) => {
    const data = {
      data: {
        type: 'person',
      },
      included: [ {
        id: orgPermissionId,
        type: 'organizational_permission',
        attributes: {
          followup_status: status,
        },
      } ],
    };
    await dispatch(callApi(REQUESTS.UPDATE_PERSON, { personId: person.id }, data));

    dispatch(trackAction(ACTIONS.STATUS_CHANGED));

    return dispatch(updatePersonAttributes(person.id, { organizational_permissions: person.organizational_permissions.map((orgPermission) => orgPermission.id === orgPermissionId ? { ...orgPermission, followup_status: status } : orgPermission) }));
  };
}

export function createContactAssignment(organizationId, personAssignedToId, personReceiverId) {
  return async(dispatch) => {
    const data = {
      included: [ {
        type: 'contact_assignment',
        attributes: {
          assigned_to_id: personAssignedToId,
          organization_id: organizationId,
        },
      } ],
    };
    await dispatch(callApi(REQUESTS.UPDATE_PERSON, { personId: personReceiverId }, data));
    dispatch(getPersonDetails(personReceiverId, organizationId));
  };
}

export function deleteContactAssignment(id, personId, personOrgId) {
  return async(dispatch) => {
    await dispatch(callApi(REQUESTS.DELETE_CONTACT_ASSIGNMENT, { contactAssignmentId: id }));
    return dispatch({
      type: DELETE_PERSON,
      personId,
      personOrgId,
    });
  };
}
