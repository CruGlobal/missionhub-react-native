import gql from 'graphql-tag';

export const GET_COMMUNITIES_QUERY = gql`
  query GetCommunities($communityCursor: String) {
    globalCommunity {
      usersReport {
        usersCount
      }
    }
    communities(
      ministryActivitiesOnly: true
      sortBy: name_ASC
      first: 10
      after: $communityCursor
    ) {
      nodes {
        id
        name
        unreadCommentsCount
        userCreated
        communityPhotoUrl
        owner: people(permissions: [owner]) {
          nodes {
            firstName
            lastName
          }
        }
        report(period: "P1W") {
          contactCount
          memberCount
          unassignedCount
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
