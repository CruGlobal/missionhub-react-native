import gql from 'graphql-tag';

export const CREATE_PERSON = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      person {
        firstName
        id
      }
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($input: UpdatePersonInput!) {
    updatePerson(input: $input) {
      person {
        firstName
        id
      }
    }
  }
`;
