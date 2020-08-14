import gql from 'graphql-tag';

import { PERSON_FRAGMENT } from '../PersonItem/queries';

export const GET_PEOPLE = gql`
  query GetPeople($myId: ID!) {
    currentUser {
      id
      person {
        ...PersonFragment
      }
    }
    people(assignedTos: [$myId]) {
      nodes {
        ...PersonFragment
      }
    }
  }
  ${PERSON_FRAGMENT}
`;
