import callApi, { REQUESTS } from './api';

export function addNewInteraction(personId, interactionId, comment, organizationId) {
  return (dispatch, getState) => {
    const myId = getState().auth.personId;
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
          interaction_type_id: interactionId,
          comment: comment ? comment : undefined,
        },
        relationships,
      },
      included: [],
    };
    const query = {};
    return dispatch(callApi(REQUESTS.ADD_NEW_INTERACTION, query, bodyData));
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
    return dispatch(callApi(REQUESTS.EDIT_COMMENT, query, bodyData));
  };
}
