import gql from 'graphql-tag';

export const GET_MY_COMMUNITY_PERMISSION_QUERY = gql`
  query getMyCommunityPermission($id: ID!, $myId: ID!) {
    community(id: $id) {
      id
      people(personIds: [$myId]) {
        edges {
          communityPermission {
            permission
          }
        }
      }
    }
  }
`;
