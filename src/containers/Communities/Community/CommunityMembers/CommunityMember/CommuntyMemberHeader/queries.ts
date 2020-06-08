import gql from 'graphql-tag';

import { AVATAR_FRAGMENT } from '../../../../../../components/Avatar/queries';

export const COMMUNITY_MEMBER_HEADER_QUERY = gql`
  query CommunityMemberHeader($personId: ID!) {
    person(id: $personId) {
      ...Avatar
      fullName
    }
  }
  ${AVATAR_FRAGMENT}
`;
