import { ThunkDispatch } from 'redux-thunk';
import gql from 'graphql-tag';
import moment from 'moment';

import { DAYS_OF_THE_WEEK } from '../constants';
import { REQUESTS } from '../api/routes';
import { ReminderTypeEnum } from '../../__generated__/globalTypes';
import { apolloClient } from '../apolloClient';

import callApi from './api';
import {
  refreshStepReminder,
  refreshStepReminderVariables,
} from './__generated__/refreshStepReminder';

const REFRESH_STEP_REMINDER_QUERY = gql`
  query refreshStepReminder($stepId: ID!) {
    step(id: $stepId) {
      id
      reminder {
        id
        reminderType
        nextOccurrenceAt
      }
    }
  }
`;

export function removeStepReminder(stepId: string) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
    await dispatch(
      callApi(REQUESTS.DELETE_CHALLENGE_REMINDER, { challenge_id: stepId }),
    );
    apolloClient.query<refreshStepReminder, refreshStepReminderVariables>({
      query: REFRESH_STEP_REMINDER_QUERY,
      variables: { stepId },
    });
  };
}

export function createStepReminder(
  stepId: string,
  reminder_at: Date,
  reminder_type = ReminderTypeEnum.once,
) {
  return async (dispatch: ThunkDispatch<never, never, never>) => {
    await dispatch(
      callApi(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id: stepId },
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
    apolloClient.query<refreshStepReminder, refreshStepReminderVariables>({
      query: REFRESH_STEP_REMINDER_QUERY,
      variables: { stepId },
    });
  };
}

function createAt(reminder_at: Date, reminder_type: string) {
  switch (reminder_type) {
    case ReminderTypeEnum.once:
      return reminder_at.toISOString();
    default:
      return moment(reminder_at).format('HH:mm:ss');
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
