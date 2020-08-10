import gql from 'graphql-tag';

import { PERSON_FRAGMENT } from '../PersonItem/queries';

export const CREATE_PERSON = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      person {
        ...PersonFragment
        firstName
        lastName
        relationshipType
        picture
      }
    }
  }
  ${PERSON_FRAGMENT}
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($input: UpdatePersonInput!) {
    updatePerson(input: $input) {
      person {
        ...PersonFragment
        firstName
        lastName
        relationshipType
        picture
      }
    }
  }
  ${PERSON_FRAGMENT}
`;
