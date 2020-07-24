import gql from 'graphql-tag';

export const NOTIFICATION_ITEM_FRAGMENT = gql`
  fragment NotificationItem on Notification {
    __typename
    id
    createdAt
    messageTemplate
    trigger
    subjectPerson {
      id
      fullName
      picture
    }
    screenData {
      feedItemId
      communityId
      challengeId
    }
    messageVariables {
      key
      value
    }
  }
`;

export const GET_COMMUNITY_INFO = gql`
  query GetCommunityInfo($communityId: ID!) {
    community(id: $communityId) {
      id
      name
      communityPhotoUrl
    }
  }
`;

export const CONTENT_COMPLAINT_GROUP_ITEM_FRAGMENT = gql`
  fragment ContentComplaintGroupItem on ContentComplaintGroup {
    __typename
    id
    subject {
      ... on Post {
        __typename
        id
        author {
          fullName
          id
        }
        feedItem {
          id
          community {
            id
            name
            communityPhotoUrl
          }
        }
        content
        mediaExpiringUrl
        createdAt
      }

      ... on FeedItemComment {
        __typename
        id
        content
        createdAt
        person {
          fullName
          id
        }
        feedItem {
          id
          community {
            id
            name
            communityPhotoUrl
          }
        }
      }
    }
  }
`;
