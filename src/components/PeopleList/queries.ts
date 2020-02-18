import gql from 'graphql-tag';

export const GET_PEOPLE_STEPS_COUNT = gql`
  query GetPeopleStepsCount($myId: [ID!]) {
    people(first: 1000, assignedTos: $myId) {
      nodes {
        id
        steps(completed: false) {
          pageInfo {
            totalCount
          }
        }
      }
    }
    currentUser {
      person {
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
