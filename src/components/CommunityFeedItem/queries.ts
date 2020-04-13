import gql from 'graphql-tag';

export const COMMUNITY_PERMISSIONS_FRAGMENT = gql`
  fragment CommunityPermissions on CommunityPermission {
    community {
      id
    }
    permission
  }
`;

export const COMMUNITY_POST_PERSON_FRAGMENT = gql`
  fragment CommunityPostPerson on Person {
    id
    firstName
    lastName
    fullName
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
      ...CommunityPostPerson
    }
    subjectPersonName
  }
  ${COMMUNITY_POST_PERSON_FRAGMENT}
`;

export const COMMUNITY_POST_FRAGMENT = gql`
  fragment CommunityPost on CommunityCelebrationItem {
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
      ...CommunityPostPerson
    }
    subjectPersonName
  }
  ${COMMUNITY_POST_PERSON_FRAGMENT}
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
