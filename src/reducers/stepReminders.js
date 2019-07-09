import { LOGOUT } from '../constants';
import { REQUESTS } from '../api/routes';

const initialState = { allByStep: {} };

export default function stepRemindersReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS:
      return addCreatedReminderToState(state, action);
    case REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS:
      return addChallengeRemindersToState(state, action);
    case REQUESTS.DELETE_CHALLENGE_REMINDER.SUCCESS:
      return removeReminderFromState(state, action);
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
      ...state.allByStep,
      [challenge_id]: response,
    },
  };
}

function addChallengeRemindersToState(state, { results: { response } }) {
  return {
    ...state,
    allByStep: response.reduce(
      (acc, { id: challenge_id, reminder }) =>
        reminder
          ? {
              ...acc,
              [challenge_id]: reminder,
            }
          : acc,
      {},
    ),
  };
}

function removeReminderFromState(state, { query: { challenge_id } }) {
  const allByStep = { ...state.allByStep };
  delete allByStep[challenge_id];
  return { ...state, allByStep };
}
