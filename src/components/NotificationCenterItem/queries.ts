import gql from 'graphql-tag';

export const NOTIFICATION_ITEM_FRAGMENT = gql`
  fragment NotificationItem on Notification {
    id
    createdAt
    messageTemplate
    trigger
    subjectPerson {
      id
      fullName
      picture
    }
    screenData {
      feedItemId
      communityId
      challengeId
    }
    messageVariables {
      key
      value
    }
  }
`;
