import gql from 'graphql-tag';

import { REMINDER_BUTTON_FRAGMENT } from '../ReminderButton/queries';
import { REMINDER_DATE_TEXT_FRAGMENT } from '../ReminderDateText/queries';

export const STEP_ITEM_FRAGMENT = gql`
  fragment StepItem on Step {
    id
    title
    completedAt
    receiver {
      id
      fullName
    }
    community {
      id
    }
    reminder {
      ...ReminderButton
      ...ReminderDateText
    }
  }
  ${REMINDER_BUTTON_FRAGMENT}
  ${REMINDER_DATE_TEXT_FRAGMENT}
`;
