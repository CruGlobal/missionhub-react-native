import gql from 'graphql-tag';
import { NOTIFICATION_ITEM_FRAGMENT } from '../../components/NotificationCenterItem/queries';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications(sortBy: createdAt_DESC) {
      nodes {
        ...NotificationItem
      }
    }
    notificationState @client {
      latestNotification
    }
  }
  ${NOTIFICATION_ITEM_FRAGMENT}
`;

export const UPDATE_HAS_UNREAD_NOTIFICATIONS = gql`
  mutation UpdateHasUnreadNotifications {
    updateHasUnreadNotifications @client {
      hasUnreadNotifications
    }
  }
`;
