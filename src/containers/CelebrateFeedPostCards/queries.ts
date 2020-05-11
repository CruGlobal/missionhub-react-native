import gql from 'graphql-tag';

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed($celebrateCursor: String) {
    globalCommunity {
      celebrationItems(
        sortBy: createdAt_DESC
        first: 100
        after: $celebrateCursor
      ) {
        nodes {
          ... on Post {
            author {
              id
              fullName
              firstName
              picture
            }
          }
        }
      }
    }
  }
`;

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed($communityId: ID!) {
    community(id: $communityId) {
      id
      feedItems(sortBy: createdAt_DESC, first: 100, unread: true) {
        nodes {
          ... on Post {
            author {
              id
              fullName
              firstName
              picture
            }
          }
        }
      }
    }
  }
`;
