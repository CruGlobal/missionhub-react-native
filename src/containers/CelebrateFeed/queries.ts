import gql from 'graphql-tag';

import {
  COMMUNITY_PERSON_FRAGMENT,
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
          id
          adjectiveAttributeName
          adjectiveAttributeValue
          celebrateableId
          celebrateableType
          changedAttributeName
          changedAttributeValue
          commentsCount
          liked
          likesCount
          objectDescription
          subjectPerson {
            ...CommunityPerson
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
  ${COMMUNITY_PERSON_FRAGMENT}
`;

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed(
    $communityId: ID!
    $subjectType: FeedItemSubjectTypeEnum = null
  ) {
    community(id: $communityId) {
      id
      feedItems(subjectType: $subjectType, sortBy: createdAt_DESC) {
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
