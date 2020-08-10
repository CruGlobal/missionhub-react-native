import gql from 'graphql-tag';

export const GET_PEOPLE_STEPS_COUNT = gql`
  query GetPeopleStepsCount($myId: [ID!]) {
    communities {
      nodes {
        id
        people(assignedTos: $myId) {
          nodes {
            id
            steps(completed: false) {
              pageInfo {
                totalCount
              }
            }
          }
        }
      }
    }
    currentUser {
      id
      person {
        id
        steps(completed: false) {
          pageInfo {
            totalCount
          }
        }
        contactAssignments(organizationIds: [null]) {
          nodes {
            id
            person {
              id
              fullName
              steps(completed: false) {
                pageInfo {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;
