import gql from 'graphql-tag';

export const GET_PEOPLE_STEPS_COUNT = gql`
  query GetPeopleStepsCount($myId: [ID!]) {
    communities {
      nodes {
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
      person {
        id
        steps(completed: false) {
          pageInfo {
            totalCount
          }
        }
        contactAssignments(organizationIds: [null]) {
          nodes {
            person {
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
      }
    }
  }
`;
