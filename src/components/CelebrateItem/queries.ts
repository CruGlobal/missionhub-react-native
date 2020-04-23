import gql from 'graphql-tag';

export const COMMUNITY_PERMISSIONS_FRAGMENT = gql`
  fragment CommunityPermissions on CommunityPermission {
    community {
      id
    }
    permission
  }
`;

export const COMMUNITY_PERSON_FRAGMENT = gql`
  fragment CommunityPerson on Person {
    id
    firstName
    lastName
    communityPermissions {
      nodes {
        ...CommunityPermissions
      }
    }
  }
  ${COMMUNITY_PERMISSIONS_FRAGMENT}
`;

export const CELEBRATE_ITEM_FRAGMENT = gql`
  fragment CelebrateItem on CommunityCelebrationItem {
    id
    adjectiveAttributeName
    adjectiveAttributeValue
    celebrateableId
    celebrateableType
    changedAttributeName
    changedAttributeValue
    commentsCount
    liked
    likesCount
    objectDescription
    subjectPerson {
      ...CommunityPerson
    }
    subjectPersonName
  }
  ${COMMUNITY_PERSON_FRAGMENT}
`;

export const COMMUNITY_FEED_CHALLENGE_FRAGMENT = gql`
  fragment CommunityFeedChallenge on CommunityChallenge {
    id
    title
  }
`;

export const COMMUNITY_FEED_STEP_FRAGMENT = gql`
  fragment CommunityFeedStep on Step {
    id
    title
  }
`;

export const COMMUNITY_FEED_POST_FRAGMENT = gql`
  fragment CommunityFeedPost on Post {
    id
    content
    mediaContentType
    mediaExpiringUrl
    postType
  }
`;

export const COMMUNITY_FEED_FRAGMENT = gql`
  fragment CommunityFeedItem on FeedItem {
    createdAt
    liked
    likesCount
    read
    subject {
      __typename
      ... on CommunityChallenge {
        ...CommunityFeedChallenge
      }
      ... on Step {
        ...CommunityFeedStep
      }
      ... on Post {
        ...CommunityFeedPost
      }
    }
    subjectPerson {
      ...CommunityPerson
    }
    subjectPersonName
  }
  ${COMMUNITY_PERSON_FRAGMENT}
  ${COMMUNITY_FEED_CHALLENGE_FRAGMENT}
  ${COMMUNITY_FEED_STEP_FRAGMENT}
  ${COMMUNITY_FEED_POST_FRAGMENT}
`;
