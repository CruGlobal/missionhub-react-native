import { REQUESTS } from './api';
import callApi from './api';

export function selectStage(id) {
  const data = {
    data: {
      attributes: {
        pathway_stage_id: id,
      },
    },
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.UPDATE_MY_USER, {}, data));
  };
}

export function updateUserStage(contactAssignmentId, stageId) {
  const data = {
    data: {
      type: 'contact_assignment',
      attributes: {
        pathway_stage_id: stageId,
      },
    },
  };
  const query = {
    contactAssignmentId,
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.UPDATE_CONTACT_ASSIGNMENT, query, data));
  };
}

export function selectPersonStage(personId, assignedToId, pathwayStageId) {
  const data = {
    data: {
      type: 'contact_assignment',
      relationships: {
        person: {
          data: {
            type: 'person',
            id: personId,
          },
        },
        assigned_to: {
          data: {
            type: 'person',
            id: assignedToId,
          },
        },
        pathway_stage: {
          data: {
            type: 'pathway_stage',
            id: pathwayStageId,
          },
        },
      },
    },
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_CONTACT_ASSIGNMENT, {}, data));
  };
}
