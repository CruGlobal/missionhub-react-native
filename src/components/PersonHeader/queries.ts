import gql from 'graphql-tag';

import { AVATAR_FRAGMENT } from '../Avatar/queries';

export const PERSON_HEADER_QUERY = gql`
  query PersonHeader($personId: ID!, $includeStage: Boolean = false) {
    person(id: $personId) {
      ...Avatar
      fullName
      stage @include(if: $includeStage) {
        id
        name
      }
    }
  }
  ${AVATAR_FRAGMENT}
`;
