import gql from 'graphql-tag';

export const COMMUNITY_FRAGMENT = gql`
  fragment CommunityFragment on Community {
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
`;

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
        ...CommunityFragment
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${COMMUNITY_FRAGMENT}
`;
