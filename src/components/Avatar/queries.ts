import gql from 'graphql-tag';

export const CURRENT_USER_AVATAR_FRAGMENT = gql`
  fragment CurrentUserAvatar on Query {
    currentUser {
      id
      person {
        id
        fullName
        picture
      }
    }
  }
`;
