import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../constants';

import callApi, { REQUESTS } from './api';

const { ONCE, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

export function createStepReminder(challenge_id, at, type) {
  return dispatch =>
    dispatch(
      callApi(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id },
        {
          data: {
            attributes: {
              type,
              at: createAt(at, type),
              on: createOn(at, type),
            },
          },
        },
      ),
    );
}

function createAt(at, type) {
  switch (type) {
    case ONCE:
      return at.toISOString();
    default:
      return at.toLocaleTimeString(undefined, { hour12: false });
  }
}

function createOn(at, type) {
  switch (type) {
    case WEEKLY:
      return DAYS_OF_THE_WEEK[at.getDay()];
    case MONTHLY:
      return at.getDate();
    default:
      return undefined;
  }
}

// todo use default params
// todo handle days greater than 28
// todo refactor ReminderRepeatButtons
// todo check suggested step detail screen
