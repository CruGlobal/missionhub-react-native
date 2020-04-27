import gql from 'graphql-tag';

export const COMMUNITY_MEMBERS_QUERY = gql`
  query CommunityMembers($id: ID!, $after: String) {
    community(id: $id) {
      userCreated
      report(period: "P99Y") {
        memberCount
      }
      people(after: $after, sortBy: firstName_ASC) {
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
