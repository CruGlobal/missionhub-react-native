import gql from 'graphql-tag';

export const COMMUNITY_HEADER_QUERY = gql`
  query CommunityHeader($id: ID!, $myId: ID!) {
    community(id: $id) {
      id
      name
      communityPhotoUrl
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

export const COMMUNITY_HEADER_GLOBAL_QUERY = gql`
  query CommunityHeaderGlobal {
    globalCommunity {
      usersReport {
        usersCount
      }
    }
  }
`;
