import gql from 'graphql-tag';

export const COMMUNITY_PROFILE_QUERY = gql`
  query CommunityProfile($communityId: ID!, $myId: ID!) {
    community(id: $communityId) {
      id
      name
      createdAt
      communityCode
      communityUrl
      communityPhotoUrl
      userCreated
      people(personIds: [$myId]) {
        edges {
          communityPermission {
            permission
          }
        }
      }
      owners: people(permissions: owner) {
        nodes {
          id
          fullName
        }
      }
      report(period: "P99Y") {
        memberCount
      }
    }
  }
`;
