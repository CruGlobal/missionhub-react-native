import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = { all: {} };

export default function stepRemindersReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS:
      return addCreatedReminderToState(state, action);
    case REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS:
      return addChallengeRemindersToState(state, action);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function addCreatedReminderToState(
  state,
  { results: { response }, query: { challenge_id } },
) {
  return {
    ...state,
    all: {
      ...state.all,
      [challenge_id]: response,
    },
  };
}

function addChallengeRemindersToState(state, { results: { response } }) {
  return {
    ...state,
    all: {
      ...state.all,
      ...response.reduce(
        (acc, { reminder }) =>
          reminder
            ? {
                ...acc,
                [reminder.id]: reminder,
              }
            : acc,
        {},
      ),
    },
  };
}
