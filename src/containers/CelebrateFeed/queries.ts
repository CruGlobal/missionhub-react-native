import gql from 'graphql-tag';

import { CELEBRATE_ITEM_FRAGMENT } from '../../components/CelebrateItem/queries';

export const GET_CELEBRATE_FEED = gql`
  query GetCelebrateFeed(
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

export const GET_GLOBAL_CELEBRATE_FEED = gql`
  query GetGlobalCelebrateFeed($celebrateCursor: String) {
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
