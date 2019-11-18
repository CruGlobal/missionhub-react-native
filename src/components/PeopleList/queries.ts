import gql from 'graphql-tag';

export const GET_PEOPLE_STEPS_COUNT = gql`
  query GetPeopleStepsCount($ids: [ID!]) {
    people(ids: $ids) {
      nodes {
        fullName
        id
        steps(completed: false) {
          pageInfo {
            totalCount
          }
        }
      }
    }
  }
`;
