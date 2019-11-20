import gql from 'graphql-tag';

export const GET_PEOPLE_STEPS_COUNT = gql`
  query GetPeopleStepsCount($id: [ID!]) {
    communities {
      nodes {
        people(assignedTos: $id) {
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
    }
    currentUser {
      person {
        contactAssignments(organizationIds: "") {
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
