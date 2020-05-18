import gql from 'graphql-tag';

export const FEED_ITEM_EDITING_COMMENT_FRAGMENT = gql`
  fragment FeedItemEditingComment on FeedItemComment {
    id
    content
  }
`;
