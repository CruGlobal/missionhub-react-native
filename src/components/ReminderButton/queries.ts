import gql from 'graphql-tag';

export const REMINDER_BUTTON_FRAGMENT = gql`
  fragment ReminderButton on StepReminder {
    id
    nextOccurrenceAt
    reminderType
  }
`;
