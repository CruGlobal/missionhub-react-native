import gql from 'graphql-tag';

export const CREATE_PERSON = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      person {
        id
        firstName
        lastName
        relationshipType
        stage {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($input: UpdatePersonInput!) {
    updatePerson(input: $input) {
      person {
        id
        firstName
        lastName
        relationshipType
        stage {
          id
          name
        }
      }
    }
  }
`;
