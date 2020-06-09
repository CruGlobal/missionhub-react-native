import gql from 'graphql-tag';

export const GET_UNREAD_NOTIFICATION_STATUS = gql`
  query getUnreadNotificationStatus {
    notificationState @client {
      latestNotification
      hasUnreadNotifications
    }
    notifications(first: 1, sortBy: createdAt_DESC) {
      nodes {
        id
        createdAt
      }
    }
  }
`;

export const UPDATE_LATEST_NOTIFICATION = gql`
  mutation updateLatestNotification($latestNotification: String!) {
    updateLatestNotification(latestNotification: $latestNotification) @client {
      hasUnreadNotifications
      latestNotification
    }
  }
`;
