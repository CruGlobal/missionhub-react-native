import gql from 'graphql-tag';

import { STEP_ITEM_FRAGMENT } from '../../components/StepItem/queries';

export const STEPS_QUERY = gql`
  query StepsList($after: String) {
    steps(after: $after, completed: false, sortBy: acceptedAt_DESC, first: 25) {
      nodes {
        ...StepItem
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${STEP_ITEM_FRAGMENT}
`;
