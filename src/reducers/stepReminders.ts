import { LOGOUT } from '../constants';
import { REQUESTS } from '../api/routes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReminderType = any; // TODO: GraphQL response type for reminder

export interface StepReminderState {
  allByStep: { [key in string]: ReminderType };
}

const initialState: StepReminderState = { allByStep: {} };

export default function stepRemindersReducer(
  state = initialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) {
  switch (action.type) {
    case REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS:
      return addCreatedReminderToState(state, action);
    case REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS:
    case REQUESTS.GET_MY_CHALLENGES.SUCCESS:
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
  state: StepReminderState,
  {
    results: { response },
    query: { challenge_id },
  }: { results: { response: ReminderType }; query: { challenge_id: string } },
) {
  return {
    ...state,
    allByStep: {
      ...state.allByStep,
      [challenge_id]: response,
    },
  };
}

function addChallengeRemindersToState(
  state: StepReminderState,
  { results: { response } }: { results: { response: ReminderType[] } },
) {
  return {
    ...state,
    allByStep: response.reduce(
      (acc, { id: challenge_id, reminder }) =>
        reminder ? { ...acc, [challenge_id]: reminder } : acc,
      {},
    ),
  };
}

function removeReminderFromState(
  state: StepReminderState,
  { query: { challenge_id } }: { query: { challenge_id: string } },
) {
  const allByStep = { ...state.allByStep };
  delete allByStep[challenge_id];
  return { ...state, allByStep };
}
