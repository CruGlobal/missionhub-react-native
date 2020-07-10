import gql from 'graphql-tag';

import { AVATAR_FRAGMENT } from '../../../components/Avatar/queries';

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
        nodes {
          ...Avatar
        }
      }
    }
  }
  ${AVATAR_FRAGMENT}
`;
