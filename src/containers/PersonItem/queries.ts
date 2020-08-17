import gql from 'graphql-tag';

export const PERSON_FRAGMENT = gql`
  fragment PersonFragment on Person {
    id
    fullName
    firstName
    lastName
    relationshipType
    picture
    stage {
      id
      name
      iconUrl
      position
    }
    steps(completed: false) {
      pageInfo {
        totalCount
      }
    }
  }
`;
