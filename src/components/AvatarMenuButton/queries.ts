import gql from 'graphql-tag';

import { CURRENT_USER_AVATAR_FRAGMENT } from '../Avatar/queries';

export const GET_CURRENT_USER_AVATAR = gql`
  query GetCurrentUserAvatar {
    ...CurrentUserAvatar
  }
  ${CURRENT_USER_AVATAR_FRAGMENT}
`;
