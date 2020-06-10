import gql from 'graphql-tag';

import { NOTIFICATION_ITEM_FRAGMENT } from '../../components/NotificationCenterItem/queries';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($notificationCursor: String) {
    notifications(
      sortBy: createdAt_DESC
      after: $notificationCursor
      first: 25
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...NotificationItem
      }
    }
  }
  ${NOTIFICATION_ITEM_FRAGMENT}
`;

export const UPDATE_LATEST_NOTIFICATION = gql`
  mutation UpdateLatestNotification($latestNotification: String!) {
    updateLatestNotification(latestNotification: $latestNotification) @client {
      lastReadDateTime
    }
  }
`;
