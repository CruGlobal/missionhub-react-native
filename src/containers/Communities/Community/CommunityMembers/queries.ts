import gql from 'graphql-tag';

export const COMMUNITY_MEMBERS_QUERY = gql`
  query CommunityMembers($id: ID!, $after: String) {
    community(id: $id) {
      userCreated
      report(period: "P99Y") {
        memberCount
      }
      people(
        after: $after
        first: 25
        permissions: [owner, admin, user]
        sortBy: firstName_ASC
      ) {
        edges {
          communityPermission {
            permission
          }
        }
        nodes {
          id
          firstName
          lastName
          picture
          createdAt
          communityPermissions {
            nodes {
              id
              permission
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
