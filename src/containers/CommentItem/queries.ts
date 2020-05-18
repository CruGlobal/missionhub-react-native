import gql from 'graphql-tag';

export const FEED_ITEM_COMMENT_ITEM_FRAGMENT = gql`
  fragment FeedItemCommentItem on FeedItemComment {
    id
    content
    createdAt
    person {
      id
      fullName
    }
  }
`;
