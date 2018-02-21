import callApi, { REQUESTS } from './api';
import { ACTIONS, INTERACTION_TYPES } from '../constants';
import { trackAction } from './analytics';

export function addNewComment(personId, comment, organizationId) {
  return (dispatch, getState) => {
    const myId = getState().auth.personId;
    if (!personId || !comment) {
      return Promise.reject('InvalidData', personId, comment);
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
          interaction_type_id: INTERACTION_TYPES.MHInteractionTypeNote.id,
          comment: comment,
        },
        relationships,
      },
      included: [],
    };
    const query = {};
    return dispatch(callApi(REQUESTS.ADD_NEW_COMMENT, query, bodyData)).then(() => dispatch(trackAction(ACTIONS.COMMENT_ADDED)));
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
