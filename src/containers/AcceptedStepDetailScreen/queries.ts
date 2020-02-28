import gql from 'graphql-tag';

import { REMINDER_BUTTON_FRAGMENT } from '../../components/ReminderButton/queries';
import { REMINDER_DATE_TEXT_FRAGMENT } from '../../components/ReminderDateText/queries';

export const ACCEPTED_STEP_DETAIL_QUERY = gql`
  query AcceptedStepDetail($id: ID!) {
    step(id: $id) {
      id
      title
      stepSuggestion {
        descriptionMarkdown
      }
      receiver {
        id
        firstName
      }
      community {
        id
      }
      reminder {
        ...ReminderButton
        ...ReminderDateText
      }
    }
  }
  ${REMINDER_BUTTON_FRAGMENT}
  ${REMINDER_DATE_TEXT_FRAGMENT}
`;
