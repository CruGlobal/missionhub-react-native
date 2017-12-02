import callApi, { REQUESTS } from './api';

export function getStepSuggestions() {
  return (dispatch) => {
    const query = {};
    // const query = { filters: { locale: 'en' } };
    return dispatch(callApi(REQUESTS.GET_CHALLENGE_SUGGESTIONS, query));
  };
}

export function addSteps() {
  return (dispatch) => {
    const query = {};
    const data = {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Steve',
          last_name: 'Rogers',
          gender: 'm',
        },
      },
      included: [
        {
          type: 'accepted_challenge',
          attributes: {
            title: 'Invite to the Avengers 1',
          },
        },
        {
          type: 'accepted_challenge',
          attributes: {
            title: 'Invite to the Avengers 2',
          },
        },
        {
          type: 'accepted_challenge',
          attributes: {
            title: 'Invite to the Avengers 3',
          },
        },
      ],
      include: 'received_challenges',
    };
    // const query = { filters: { locale: 'en' } };
    return dispatch(callApi(REQUESTS.ADD_CHALLENGES, query, data));
  };
}
