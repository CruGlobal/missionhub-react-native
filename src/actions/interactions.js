import { ACTIONS } from '../constants';

import callApi, { REQUESTS } from './api';
import { trackAction } from './analytics';
import { refreshImpact } from './impact';

export function addNewInteraction(personId, interaction, comment, organizationId) {
  return (dispatch, getState) => {
    const { person: { id: myId } } = getState().auth;
    if (!personId) {
      return Promise.reject('InvalidData');
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
    return dispatch(callApi(REQUESTS.ADD_NEW_INTERACTION, {}, bodyData))
      .then((r) => {
        dispatch(trackAction(interaction.tracking));
        dispatch(refreshImpact());
        return r;
      });
  };
}

export function editComment(interaction, comment) {
  return (dispatch) => {
    if (!interaction || !comment) {
      return Promise.reject('InvalidDataEditComment');
    }

    const bodyData = {
      data: {
        type: 'interaction',
        attributes: {
          comment: comment,
        },
      },
      included: [],
    };
    const query = {
      interactionId: interaction.id,
    };
    return dispatch(callApi(REQUESTS.EDIT_COMMENT, query, bodyData)).then(() => dispatch(trackAction(ACTIONS.JOURNEY_EDITED)));
  };
}
