import { DAYS_OF_THE_WEEK } from '../constants';

import callApi, { REQUESTS } from './api';

export function createStepReminder(challenge_id, at, recurrence) {
  const type = recurrence || 'once';

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
    case 'once':
      return at.toISOString();
    default:
      return at.toLocaleTimeString(undefined, { hour12: false });
  }
}

function createOn(at, type) {
  switch (type) {
    case 'weekly':
      return DAYS_OF_THE_WEEK[at.getDay()];
    case 'monthly':
      return at.getDate();
    default:
      return undefined;
  }
}

// todo use default params
// todo handle days greater than 28
// todo refactor ReminderRepeatButtons
// todo refactor Reminder Button
// todo check suggested step detail screen
