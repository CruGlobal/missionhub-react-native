import { DAYS_OF_THE_WEEK } from '../constants';

import callApi, { REQUESTS } from './api';

export function createStepReminder(challenge_id, at, recurrence) {
  return dispatch => {
    const type = recurrence || 'once';

    const payload = {
      data: {
        attributes: {
          type,
          at:
            type === 'once'
              ? at.toISOString()
              : at.toLocaleTimeString(undefined, { hour12: false }),
          on: createOn(at, type),
        },
      },
    };

    return dispatch(
      callApi(REQUESTS.CREATE_CHALLENGE_REMINDER, { challenge_id }, payload),
    );
  };
}

function createOn(at, type) {
  if (type === 'once') {
    return undefined;
  }

  if (type === 'daily') {
    return undefined;
  }

  if (type === 'weekly') {
    return DAYS_OF_THE_WEEK[at.getDay()];
  }

  return at.getDate();
}

// todo use default params
// todo handle days greater than 28
// todo refactor ReminderRepeatButtons
// todo refactor this class
// todo refactor Reminder Button
// todo check suggested step detail screen
