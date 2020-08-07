import gql from 'graphql-tag';

export const PERSON_FRAGMENT = gql`
  fragment PersonFragment on Person {
    id
    fullName
    stage {
      id
      name
      nameI18n
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
