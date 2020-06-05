import gql from 'graphql-tag';

export const IMPACT_QUERY = gql`
  query Impact($personId: ID!) {
    person(id: $personId) {
      id
      firstName
    }
  }
`;
