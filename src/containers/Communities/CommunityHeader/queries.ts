import gql from 'graphql-tag';

export const COMMUNITY_HEADER_QUERY = gql`
  query CommunityHeader($id: ID!) {
    community(id: $id) {
      name
      communityPhotoUrl
      report(period: "P99Y") {
        memberCount
      }
    }
  }
`;
