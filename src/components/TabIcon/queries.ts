import gql from 'graphql-tag';

export const GET_UNREAD_COMMENTS_AND_NOTIFICATION = gql`
  query getUnreadCommentAndNotification {
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
