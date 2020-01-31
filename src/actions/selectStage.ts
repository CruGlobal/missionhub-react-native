/* eslint max-params: 0 */
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { REQUESTS } from '../api/routes';

import callApi from './api';
import { refreshImpact } from './impact';
import { getPersonDetails } from './person';

export function selectMyStage(id: string) {
  const data = {
    data: {
      attributes: {
        pathway_stage_id: id,
      },
    },
  };

  return (dispatch: ThunkDispatch<void, null, AnyAction>) => {
    return dispatch(callApi(REQUESTS.UPDATE_ME_USER, {}, data));
  };
}

export function updateUserStage(contactAssignmentId: string, stageId: string) {
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

  return async (dispatch: ThunkDispatch<void, null, AnyAction>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { response }: any = await dispatch(
      callApi(REQUESTS.UPDATE_CONTACT_ASSIGNMENT, query, data),
    );
    const { person, organization } = response;
    const personId = person && person.id;
    const orgId = organization && organization.id;

    dispatch(refreshImpact(orgId));
    dispatch(getPersonDetails(personId, orgId));
    return response;
  };
}

export function selectPersonStage(
  personId: string,
  assignedToId: string,
  pathwayStageId: string,
  orgId?: string,
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

  return async (dispatch: ThunkDispatch<void, null, AnyAction>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { response }: any = await dispatch(
      callApi(REQUESTS.CREATE_CONTACT_ASSIGNMENT, {}, data),
    );

    dispatch(refreshImpact(orgId));
    dispatch(getPersonDetails(personId, orgId));
    return response;
  };
}
