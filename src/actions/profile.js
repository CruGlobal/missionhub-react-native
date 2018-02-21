import {
  FIRST_NAME_CHANGED, LAST_NAME_CHANGED, SET_VISIBLE_PERSON_INFO, UPDATE_VISIBLE_PERSON_INFO,
  UPDATE_ONBOARDING_PERSON, ACTIONS,
} from '../constants';
import { REQUESTS } from './api';
import callApi from './api';
import uuidv4 from 'uuid/v4';
import { getStages } from './stages';
import { getPersonDetails } from './people';
import { trackAction } from './analytics';

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

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data));
  };
}

export function createPerson(firstName, lastName) {
  const data = {
    data: {
      type: 'person',
      attributes: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, {}, data));
  };
}

export function updateOnboardingPerson(data) {
  return (dispatch) => {
    return dispatch(updatePerson(data)).then((r) => {
      dispatch({ type: UPDATE_ONBOARDING_PERSON, results: r });
      return r;
    });
  };
}

export function setVisiblePersonInfo(info) {
  return {
    type: SET_VISIBLE_PERSON_INFO,
    data: info,
  };
}

export function updateVisiblePersonInfo(info) {
  return {
    type: UPDATE_VISIBLE_PERSON_INFO,
    data: info,
  };
}

export function fetchVisiblePersonInfo(personId, currentUserId, personIsCurrentUser, stages) {
  return async(dispatch) => {
    return await dispatch(updateVisiblePersonInfo(await getPersonWithAssignmentAndStage(personId, currentUserId, personIsCurrentUser, stages)));

    async function getPersonWithAssignmentAndStage(personId, currentUserId, personIsCurrentUser, stages) {
      if (personId) {
        const results = await dispatch(getPersonDetails(personId));
        const person = results.find('person', personId);
        const { contactAssignmentId, pathwayStageId } = personIsCurrentUser ?
          getPathwayStageIdFromUser(results) :
          getAssignmentWithPathwayStageId(results);

        const contactStage = await getContactStage(pathwayStageId);
        return {
          person,
          contactAssignmentId,
          contactStage,
        };
      }

      function getPathwayStageIdFromUser(results) {
        const user = results.findAll('user')[0];
        return {
          contactAssignmentId: null,
          pathwayStageId: user && user.pathway_stage_id,
        };
      }

      function getAssignmentWithPathwayStageId(results) {
        const assignment = results.findAll('contact_assignment')
          .find((a) => a && a.assigned_to ? a.assigned_to.id === currentUserId : false);
        return {
          contactAssignmentId: assignment && assignment.id,
          pathwayStageId: assignment && assignment.pathway_stage_id,
        };
      }

      async function getContactStage(pathwayStageId) {
        if (pathwayStageId) {
          const stageResults = stages.length > 0 ?
            stages :
            (await dispatch(getStages())).findAll('pathway_stage');
          return stageResults.find((s) => s.id === pathwayStageId.toString());
        }
      }
    }
  };
}

export function updatePerson(data) {
  return (dispatch) => {
    if (!data || !data.firstName) {
      return dispatch({ type: 'UPDATE_PERSON_FAIL', error: 'InvalidData', data });
    }
    const bodyData = {
      data: {
        type: 'person',
        attributes: {
          first_name: data.firstName,
          ...data.lastName ? { last_name: data.lastName } : {},
          ...data.gender ? { gender: data.gender } : {},
        },
      },
      ...data.email || data.phone ? {
        included: [
          ...data.email ? [ {
            id: data.emailId,
            type: 'email',
            attributes: { email: data.email },
          } ]: [],
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
    };
    return dispatch(callApi(REQUESTS.UPDATE_PERSON, query, bodyData));
  };
}

export function updateFollowupStatus(personId, orgPermissionId, status) {
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

    const result = await dispatch(callApi(REQUESTS.UPDATE_PERSON, { personId }, data));
    dispatch(trackAction(ACTIONS.STATUS_CHANGED));
    return result;
  };
}

export function deleteContactAssignment(id) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.DELETE_CONTACT_ASSIGNMENT, { contactAssignmentId: id }));
  };
}
