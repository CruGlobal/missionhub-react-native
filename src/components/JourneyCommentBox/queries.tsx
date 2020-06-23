import gql from 'graphql-tag';

import { CURRENT_USER_AVATAR_FRAGMENT } from '../Avatar/queries';

export const JOURNEY_COMMENT_BOX_QUERY = gql`
  query JourneyCommentBox {
    ...CurrentUserAvatar
  }
  ${CURRENT_USER_AVATAR_FRAGMENT}
`;
