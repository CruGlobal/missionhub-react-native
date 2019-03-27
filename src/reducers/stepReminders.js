import { LOGOUT } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = { all: {} };

export default function stepRemindersReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS:
      return addCreatedReminderToState(state, action);
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
    all: {
      ...state.all,
      [challenge_id]: response,
    },
  };
}

function removeReminderFromState(state, { query: { challenge_id } }) {
  const all = { ...state.all };
  delete all[challenge_id];
  return { ...state, all };
}
