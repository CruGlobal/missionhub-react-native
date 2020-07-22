import gql from 'graphql-tag';

import { AVATAR_FRAGMENT } from '../Avatar/queries';

export const GET_MY_AVATAR_AND_EMAIL = gql`
  query GetMyAvatarAndEmail {
    currentUser {
      id
      person {
        id
        fullName
        emailAddressesList {
          id
          email
        }
        ...Avatar
      }
    }
  }
  ${AVATAR_FRAGMENT}
`;
