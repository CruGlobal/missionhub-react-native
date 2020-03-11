import gql from 'graphql-tag';

export const GET_UNREAD_COMMENTS_COUNT = gql`
  query getUnreadCommentsCount {
    communities {
      nodes {
        unreadCommentsCount
      }
    }
  }
`;
