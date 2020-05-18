import gql from 'graphql-tag';

import {
  COMMUNITY_FEED_CHALLENGE_FRAGMENT,
  COMMUNITY_FEED_STEP_FRAGMENT,
  COMMUNITY_FEED_POST_FRAGMENT,
  COMMUNITY_FEED_ITEM_FRAGMENT,
} from '../../components/CommunityFeedItem/queries';

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed($celebrateCursor: String) {
    globalCommunity {
      feedItems(sortBy: createdAt_DESC, first: 25, after: $celebrateCursor) {
        nodes {
          id
          comments {
            pageInfo {
              totalCount
            }
          }
          createdAt
          liked
          likesCount
          read
          subject {
            ... on CommunityChallenge {
              ...CommunityFeedChallenge
            }
            ... on Step {
              ...CommunityFeedStep
            }
            ... on Post {
              ...CommunityFeedPost
            }
          }
          subjectPersonName
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_FEED_CHALLENGE_FRAGMENT}
  ${COMMUNITY_FEED_STEP_FRAGMENT}
  ${COMMUNITY_FEED_POST_FRAGMENT}
`;

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed(
    $communityId: ID!
    $subjectType: FeedItemSubjectTypeEnum = null
    $celebrateCursor: String
  ) {
    community(id: $communityId) {
      id
      feedItems(
        subjectType: $subjectType
        sortBy: createdAt_DESC
        first: 25
        after: $celebrateCursor
      ) {
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
