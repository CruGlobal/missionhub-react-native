import gql from 'graphql-tag';

export const GET_UNREAD_NOTIFICATION_STATUS = gql`
  query GetUnreadNotificationStatus {
    notificationState @client {
      lastReadDateTime
    }
    notifications(first: 1, sortBy: createdAt_DESC) {
      nodes {
        id
        createdAt
      }
    }
  }
`;
