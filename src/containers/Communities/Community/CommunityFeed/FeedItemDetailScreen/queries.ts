import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT } from '../../../../../components/CommunityFeedItemContent/queries';
import { FEED_ITEM_COMMENT_ITEM_FRAGMENT } from '../../../../CommentsList/queries';
import { FEED_ITEM_EDITING_COMMENT_FRAGMENT } from './FeedCommentBox/queries';

export const FEED_ITEM_DETAIL_QUERY = gql`
  query FeedItemDetail($feedItemId: ID!, $myId: ID!, $commentsCursor: String) {
    feedItem(id: $feedItemId) {
      id
      ...CommunityFeedItemContent
      comments(after: $commentsCursor) {
        nodes {
          id
          ...FeedItemCommentItem
          ...FeedItemEditingComment
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      community {
        id
        name
        people(personIds: [$myId]) {
          edges {
            communityPermission {
              permission
            }
          }
        }
      }
    }
  }
  ${COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT}
  ${FEED_ITEM_COMMENT_ITEM_FRAGMENT}
  ${FEED_ITEM_EDITING_COMMENT_FRAGMENT}
`;
