import gql from 'graphql-tag';

import { STEP_DETAIL_POST_FRAGMENT } from '../../components/StepDetailScreen/queries';

export const COMPLETED_STEP_DETAIL_QUERY = gql`
  query CompletedStepDetail($id: ID!) {
    step(id: $id) {
      id
      title
      completedAt
      stepType
      stepSuggestion {
        id
        descriptionMarkdown
      }
      receiver {
        id
        firstName
      }
      post {
        ...StepDetailPost
      }
    }
  }
  ${STEP_DETAIL_POST_FRAGMENT}
`;
