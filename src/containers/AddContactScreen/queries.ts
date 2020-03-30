import gql from 'graphql-tag';

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      firstName
      lastName
      id
      relationshipType
    }
  }
`;
