import gql from 'graphql-tag';

import {
  CELEBRATE_ITEM_FRAGMENT,
  COMMUNITY_FEED_ITEM_FRAGMENT,
} from '../../components/CommunityFeedItem/queries';

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed($celebrateCursor: String) {
    globalCommunity {
      celebrationItems(
        sortBy: createdAt_DESC
        first: 25
        after: $celebrateCursor
      ) {
        nodes {
          ...CelebrateItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${CELEBRATE_ITEM_FRAGMENT}
`;

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed(
    $communityId: ID!
    $subjectType: FeedItemSubjectTypeEnum = null
  ) {
    community(id: $communityId) {
      feedItems(subjectType: $subjectType) {
        nodes {
          ...CommunityFeedItem
        }
      }
    }
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
`;
