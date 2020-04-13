import gql from 'graphql-tag';

export const COMMUNITY_HEADER_QUERY = gql`
  query CommunityHeader($id: ID!, $myId: ID!) {
    community(id: $id) {
      name
      communityPhotoUrl
      userCreated
      report(period: "P99Y") {
        memberCount
      }
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
