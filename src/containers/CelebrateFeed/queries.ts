import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../components/CommunityFeedItem/queries';
import { CURRENT_USER_AVATAR_FRAGMENT } from '../../components/Avatar/queries';

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed(
    $subjectType: FeedItemSubjectTypeEnum = null
    $feedItemsCursor: String
    $commentsCursor: String # not used by this query but needed to make CommunityFeedItemCommentLike.comments fragment happy
  ) {
    globalCommunity {
      feedItems(
        subjectType: $subjectType
        sortBy: createdAt_DESC
        after: $feedItemsCursor
      ) {
        nodes {
          read
          ...CommunityFeedItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    ...CurrentUserAvatar
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
  ${CURRENT_USER_AVATAR_FRAGMENT}
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
      feedItems(
        subjectType: $subjectType
        sortBy: createdAt_DESC
        after: $feedItemsCursor
      ) {
        nodes {
          read
          ...CommunityFeedItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    ...CurrentUserAvatar
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
  ${CURRENT_USER_AVATAR_FRAGMENT}
`;
