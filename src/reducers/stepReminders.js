import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = { allByStep: {} };

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
    allByStep: {
      ...state.all,
      [challenge_id]: response,
    },
  };
}

function addChallengeRemindersToState(state, { results: { response } }) {
  return {
    ...state,
    allByStep: {
      ...state.all,
      ...response.reduce(
        (acc, { id: challenge_id, reminder }) =>
          reminder
            ? {
                ...acc,
                [challenge_id]: reminder,
              }
            : acc,
        {},
      ),
    },
  };
}
