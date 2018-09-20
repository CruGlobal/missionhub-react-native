import { REQUESTS } from './api';
import callApi from './api';
import { refreshImpact } from './impact';
import { getPersonDetails } from './person';

export function selectMyStage(id) {
  const data = {
    data: {
      attributes: {
        pathway_stage_id: id,
      },
    },
  };

  return dispatch => {
    return dispatch(callApi(REQUESTS.UPDATE_ME_USER, {}, data));
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

  return dispatch => {
    return dispatch(
      callApi(REQUESTS.UPDATE_CONTACT_ASSIGNMENT, query, data),
    ).then(r => {
      dispatch(refreshImpact());
      return r;
    });
  };
}

export function selectPersonStage(
  personId,
  assignedToId,
  pathwayStageId,
  orgId,
) {
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
        organization: {
          data: {
            type: 'organization',
            id: orgId,
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

  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.CREATE_CONTACT_ASSIGNMENT, {}, data),
    );
    dispatch(refreshImpact());
    dispatch(getPersonDetails());
    return response;
  };
}
