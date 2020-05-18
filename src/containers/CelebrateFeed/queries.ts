import gql from 'graphql-tag';

import {
  GLOBAL_COMMUNITY_FEED_ITEM_FRAGMENT,
  COMMUNITY_FEED_ITEM_FRAGMENT,
} from '../../components/CommunityFeedItem/queries';

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed($feedItemsCursor: String) {
    globalCommunity {
      feedItems(sortBy: createdAt_DESC, after: $feedItemsCursor) {
        nodes {
          ...GlobalCommunityFeedItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${GLOBAL_COMMUNITY_FEED_ITEM_FRAGMENT}
`;

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed(
    $communityId: ID!
    $subjectType: FeedItemSubjectTypeEnum = null
    $feedItemsCursor: String
    $commentsCursor: String # not used by this query but needed to make CommunityFeedItemCommentLike.comments fragment happy
  ) {
    community(id: $communityId) {
      id
      feedItems(subjectType: $subjectType, sortBy: createdAt_DESC, after: $feedItemsCursor) {
        nodes {
          ...CommunityFeedItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
`;
