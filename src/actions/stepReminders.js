import { Alert } from 'react-native';
import i18n from 'i18next';

import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../constants';

import callApi, { REQUESTS } from './api';

const { ONCE, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

export function createStepReminder(challenge_id, at, type) {
  return async dispatch => {
    try {
      return await dispatch(
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
    } catch (error) {
      const { apiError } = error;

      if (
        apiError.errors &&
        apiError.errors[0] &&
        apiError.errors[0].detail && //todo extract
        apiError.errors[0].detail.recurrence_rule &&
        apiError.errors[0].detail.recurrence_rule[0].includes(
          "Value of 'at' is invalid,",
        )
      ) {
        Alert.alert(
          i18n.t('stepReminder:invalidReminderErrorHeader'),
          i18n.t('stepReminder:invalidReminderErrorBody'),
        ); //todo extract?
      }

      throw error;
    }
  };
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
      return getDayOfMonth(at.getDate());
    default:
      return undefined;
  }
}

function getDayOfMonth(day) {
  if (day > 28) {
    return day - 32;
  }

  return day;
}
