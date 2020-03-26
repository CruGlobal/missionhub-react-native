import gql from 'graphql-tag';

import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../../actions/analyticsQueries';

export const CREATE_CUSTOM_STEP_MUTATION = gql`
  mutation CreateCustomStep(
    $title: String!
    $receiverId: ID!
    $communityId: ID
    $stepType: StepTypeEnum
  ) {
    createStep(
      input: {
        title: $title
        receiverId: $receiverId
        communityId: $communityId
        stepType: $stepType
      }
    ) {
      step {
        ...StepAddedAnalytics
      }
    }
  }
  ${STEP_ADDED_ANALYTICS_FRAGMENT}
`;
