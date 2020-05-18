import gql from 'graphql-tag';

import { FEED_ITEM_COMMENT_ITEM_FRAGMENT } from '../CommentItem/queries';

export const FEED_ITEM_COMMENTS_FRAGMENT = gql`
  fragment FeedItemCommentConnection on FeedItemCommentConnection {
    nodes {
      ...FeedItemCommentItem
    }
    pageInfo {
      hasNextPage
    }
  }
  ${FEED_ITEM_COMMENT_ITEM_FRAGMENT}
`;
