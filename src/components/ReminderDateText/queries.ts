import gql from 'graphql-tag';

export const REMINDER_DATE_TEXT_FRAGMENT = gql`
  fragment ReminderDateText on StepReminder {
    id
    nextOccurrenceAt
    reminderType
  }
`;
