import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../constants';

import callApi, { REQUESTS } from './api';

const { ONCE, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

export function removeStepReminder(challenge_id) {
  return dispatch =>
    dispatch(callApi(REQUESTS.DELETE_CHALLENGE_REMINDER, { challenge_id }));
}

export function createStepReminder(challenge_id, reminder_at, reminder_type) {
  return dispatch =>
    dispatch(
      callApi(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id },
        {
          data: {
            attributes: {
              reminder_type,
              reminder_at: createAt(reminder_at, reminder_type),
              reminder_on: createOn(reminder_at, reminder_type),
            },
          },
        },
      ),
    );
}

function createAt(reminder_at, reminder_type) {
  switch (reminder_type) {
    case ONCE:
      return reminder_at.toISOString();
    default:
      return reminder_at.toLocaleTimeString(undefined, { hour12: false });
  }
}

function createOn(reminder_at, reminder_type) {
  switch (reminder_type) {
    case WEEKLY:
      return DAYS_OF_THE_WEEK[reminder_at.getDay()];
    case MONTHLY:
      return getDayOfMonth(reminder_at.getDate());
    default:
      return null;
  }
}

function getDayOfMonth(day) {
  if (day > 28) {
    return day - 32;
  }

  return day;
}
