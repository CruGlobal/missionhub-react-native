import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = { all: {} };

export default function stepRemindersReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS:
      return addCreatedReminderToState(state, action);
    case REQUESTS.DELETE_CHALLENGE_REMINDER.SUCCESS:

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

function removeReminderFromState(state, { query: { challenge_id } }) {
  return {
    ...state,
    all: Object.entries(state.all).reduce(
      (acc, [id, reminder]) =>
        id === challenge_id ? acc : { ...acc, [id]: reminder },
      {},
    ),
  };
}
