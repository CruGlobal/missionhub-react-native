import gql from 'graphql-tag';

export const COMMUNITY_UNREAD_COMMENTS_FRAGMENT = gql`
  fragment CommunityUnreadComments on Community {
    id
    unreadCommentsCount
  }
`;

export const GET_UNREAD_COMMENTS_COUNT = gql`
  query getUnreadCommentsCount {
    communities {
      nodes {
        ...CommunityUnreadComments
      }
    }
  }
  ${COMMUNITY_UNREAD_COMMENTS_FRAGMENT}
`;
