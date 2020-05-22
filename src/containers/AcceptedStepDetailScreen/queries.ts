import gql from 'graphql-tag';

import { REMINDER_BUTTON_FRAGMENT } from '../../components/ReminderButton/queries';
import { REMINDER_DATE_TEXT_FRAGMENT } from '../../components/ReminderDateText/queries';

const POST_FRAGMENT = gql`
  fragment Post on Post {
    id
    author {
      id
      firstName
      lastName
      fullName
      picture
    }
    content
    createdAt
    mediaExpiringUrl
  }
`;

export const ACCEPTED_STEP_DETAIL_QUERY = gql`
  query AcceptedStepDetail($id: ID!) {
    step(id: $id) {
      id
      title
      stepType
      stepSuggestion {
        id
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
      post {
        ...Post
      }
    }
  }
  ${REMINDER_BUTTON_FRAGMENT}
  ${REMINDER_DATE_TEXT_FRAGMENT}
  ${POST_FRAGMENT}
`;
