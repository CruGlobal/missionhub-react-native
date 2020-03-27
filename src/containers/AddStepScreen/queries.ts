import gql from 'graphql-tag';

import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../../actions/analyticsQueries';

export const CREATE_CUSTOM_STEP_MUTATION = gql`
  mutation CreateCustomStep(
    $title: String!
    $receiverId: ID!
    $stepType: StepTypeEnum
  ) {
    createCustomStep(
      input: { title: $title, receiverId: $receiverId, stepType: $stepType }
    ) {
      step {
        ...StepAddedAnalytics
      }
    }
  }
  ${STEP_ADDED_ANALYTICS_FRAGMENT}
`;
