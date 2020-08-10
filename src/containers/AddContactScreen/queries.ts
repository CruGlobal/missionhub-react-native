import gql from 'graphql-tag';

import { PERSON_FRAGMENT } from '../PersonItem/queries';

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      ...PersonFragment
      firstName
      lastName
      relationshipType
      picture
    }
  }
  ${PERSON_FRAGMENT}
`;
