import gql from 'graphql-tag';

import { STEP_ITEM_FRAGMENT } from '../../components/StepItem/queries';

export const PERSON_STEPS_QUERY = gql`
  query PersonStepsList($personId: ID!, $completed: Boolean!, $after: String) {
    person(id: $personId) {
      id
      steps(after: $after, completed: $completed, sortBy: acceptedAt_DESC) {
        nodes {
          id
          ...StepItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      completedSteps: steps(completed: true) @skip(if: $completed) {
        pageInfo {
          totalCount
        }
      }
    }
  }
  ${STEP_ITEM_FRAGMENT}
`;
