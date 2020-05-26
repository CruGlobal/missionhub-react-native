import gql from 'graphql-tag';

export const AVATAR_FRAGMENT = gql`
  fragment Avatar on Person {
    id
    fullName
    picture
  }
`;

export const CURRENT_USER_AVATAR_FRAGMENT = gql`
  fragment CurrentUserAvatar on Query {
    currentUser {
      id
      person {
        ...Avatar
      }
    }
  }
  ${AVATAR_FRAGMENT}
`;
