import { ThunkDispatch } from 'redux-thunk';

import { DAYS_OF_THE_WEEK } from '../constants';
import { REQUESTS } from '../api/routes';
import { ReminderTypeEnum } from '../../__generated__/globalTypes';

import callApi from './api';

export function removeStepReminder(challenge_id: string) {
  return (dispatch: ThunkDispatch<never, never, never>) =>
    dispatch(callApi(REQUESTS.DELETE_CHALLENGE_REMINDER, { challenge_id }));
}

export function createStepReminder(
  challenge_id: string,
  reminder_at: Date,
  reminder_type = ReminderTypeEnum.once,
) {
  return (dispatch: ThunkDispatch<never, never, never>) =>
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

function createAt(reminder_at: Date, reminder_type: string) {
  switch (reminder_type) {
    case ReminderTypeEnum.once:
      return reminder_at.toISOString();
    default:
      return reminder_at.toLocaleTimeString(undefined, { hour12: false });
  }
}

function createOn(reminder_at: Date, reminder_type: ReminderTypeEnum) {
  switch (reminder_type) {
    case ReminderTypeEnum.weekly:
      return DAYS_OF_THE_WEEK[reminder_at.getDay()];
    case ReminderTypeEnum.monthly:
      return getDayOfMonth(reminder_at.getDate());
    default:
      return null;
  }
}

function getDayOfMonth(day: number) {
  if (day > 28) {
    return day - 32;
  }

  return day;
}
