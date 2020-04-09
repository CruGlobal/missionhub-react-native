import gql from 'graphql-tag';

export const COMMUNITY_PERMISSIONS_FRAGMENT = gql`
  fragment CommunityPermissions on CommunityPermission {
    community {
      id
    }
    permission
  }
`;

export const CELEBRATE_ITEM_PERSON_FRAGMENT = gql`
  fragment CelebrateItemPerson on Person {
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

export const COMMUNTIY_POST_PERSON = gql`
  fragment CommunityPostPerson on Person {
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
      ...CelebrateItemPerson
    }
    subjectPersonName
  }
  ${CELEBRATE_ITEM_PERSON_FRAGMENT}
`;

export const COMMUNITY_POST_FRAGMENT = gql`
  fragment CommunityPostItem on Post {
    id
    author {
      ...CelebrateItemPerson
    }
    community {
      id
      name
    }
    content
    createdAt
    postType
    updatedAt
  }
  ${COMMUNTIY_POST_PERSON}
`;

export const DELETE_POST = gql`
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      id
    }
  }
`;

export const REPORT_POST = gql`
  mutation ReportPost($subjectId: ID!) {
    createContentComplaint(
      input: { subjectId: $subjectId, subjectType: Post }
    ) {
      contentComplaint {
        id
      }
    }
  }
`;
