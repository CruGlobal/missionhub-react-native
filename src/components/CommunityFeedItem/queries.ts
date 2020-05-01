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
    __typename
    id
    title
    acceptedCommunityChallengesList {
      id
      acceptedAt
      completedAt
    }
  }
`;

export const COMMUNITY_FEED_STEP_FRAGMENT = gql`
  fragment CommunityFeedStep on Step {
    __typename
    id
    receiverStageAtCompletion {
      id
    }
  }
`;

export const COMMUNITY_FEED_POST_FRAGMENT = gql`
  fragment CommunityFeedPost on Post {
    __typename
    id
    content
    mediaContentType
    mediaExpiringUrl
    postType
  }
`;

export const COMMUNITY_FEED_ITEM_FRAGMENT = gql`
  fragment CommunityFeedItem on FeedItem {
    id
    comments {
      pageInfo {
        totalCount
      }
    }
    createdAt
    liked
    likesCount
    read
    subject {
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
  ${COMMUNITY_FEED_CHALLENGE_FRAGMENT}
  ${COMMUNITY_FEED_STEP_FRAGMENT}
  ${COMMUNITY_FEED_POST_FRAGMENT}
  ${COMMUNITY_PERSON_FRAGMENT}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(input: { id: $id }) {
      id
    }
  }
`;

export const REPORT_POST = gql`
  mutation ReportPost($id: ID!) {
    createContentComplaint(input: { subjectId: $id, subjectType: Post }) {
      contentComplaint {
        id
      }
    }
  }
`;
