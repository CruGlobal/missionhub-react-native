import gql from 'graphql-tag';

import { COMMUNITY_POST_FRAGMENT } from '../../components/CommunityFeedItem/queries';

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed(
    $communityId: ID!
    $personIds: [ID!] = null
    $hasUnreadComments: Boolean = false
    $celebrateCursor: String
  ) {
    community(id: $communityId) {
      celebrationItems(
        sortBy: createdAt_DESC
        first: 25
        after: $celebrateCursor
        subjectPersonIds: $personIds
        hasUnreadComments: $hasUnreadComments
      ) {
        nodes {
          ...CommunityPost
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_POST_FRAGMENT}
`;

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed($celebrateCursor: String) {
    globalCommunity {
      celebrationItems(
        sortBy: createdAt_DESC
        first: 25
        after: $celebrateCursor
      ) {
        nodes {
          ...CommunityPost
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_POST_FRAGMENT}
`;
