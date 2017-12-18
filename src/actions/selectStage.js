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
    return dispatch(callApi(REQUESTS.UPDATE_MY_USER, {}, data)).catch((error) => {
      LOG('error updating my user', error);
    });
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
    return dispatch(callApi(REQUESTS.CREATE_CONTACT_ASSIGNMENT, {}, data)).catch((error) => {
      LOG('error creating contact assignment', error);
    });
  };
}