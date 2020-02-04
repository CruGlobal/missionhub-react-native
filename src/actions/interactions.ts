/* eslint max-params: 0, max-lines-per-function: 0 */

import { ACTIONS } from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';
import { trackAction, trackActionWithoutData } from './analytics';
import { refreshImpact } from './impact';
import { reloadJourney } from './journey';

export function addNewInteraction(
  // @ts-ignore
  personId,
  // @ts-ignore
  interaction,
  // @ts-ignore
  comment,
  // @ts-ignore
  organizationId,
) {
  // @ts-ignore
  return async (dispatch, getState) => {
    const {
      person: { id: myId },
    } = getState().auth;
    if (!personId) {
      return Promise.reject(
        'Invalid Data from addNewInteraction: no personId passed in',
      );
    }

    const relationships = {
      receiver: {
        data: {
          type: 'person',
          id: personId,
        },
      },
      initiators: {
        data: [
          {
            type: 'person',
            id: myId,
          },
        ],
      },
    };
    if (organizationId) {
      // @ts-ignore
      relationships.organization = {
        data: {
          type: 'organization',
          id: organizationId,
        },
      };
    }

    const bodyData = {
      data: {
        type: 'interaction',
        attributes: {
          interaction_type_id: interaction.id,
          comment: comment ? comment : undefined,
        },
        relationships,
      },
      included: [],
    };
    const response = await dispatch(
      callApi(REQUESTS.ADD_NEW_INTERACTION, {}, bodyData),
    );

    dispatch(
      trackAction(ACTIONS.INTERACTION.name, {
        [interaction.tracking]: null,
      }),
    );
    dispatch(reloadJourney(personId, organizationId));
    dispatch(refreshImpact(organizationId));

    return response;
  };
}

// @ts-ignore
export function editComment(interactionId, comment) {
  // @ts-ignore
  return dispatch => {
    if (!interactionId || !comment) {
      return Promise.reject(
        'Invalid Data from editComment: no interaction or no comment passed in',
      );
    }

    const bodyData = {
      data: {
        type: 'interaction',
        attributes: {
          comment,
        },
      },
      included: [],
    };
    const query = {
      interactionId,
    };
    return dispatch(callApi(REQUESTS.EDIT_COMMENT, query, bodyData)).then(() =>
      dispatch(trackActionWithoutData(ACTIONS.JOURNEY_EDITED)),
    );
  };
}
