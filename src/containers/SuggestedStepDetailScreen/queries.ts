import gql from 'graphql-tag';

import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../../actions/analyticsQueries';

export const STEP_SUGGESTION_QUERY = gql`
  query StepSuggestion($stepSuggestionId: ID!, $personId: ID!) {
    stepSuggestion(id: $stepSuggestionId) {
      id
      body
      descriptionMarkdown
      stepType
    }
    person(id: $personId) {
      id
      firstName
    }
  }
`;

export const CREATE_STEP_FROM_SUGGESTION_MUTATION = gql`
  mutation CreateStepFromSuggestion($receiverId: ID!, $stepSuggestionId: ID!) {
    createStepFromSuggestion(
      input: { receiverId: $receiverId, stepSuggestionId: $stepSuggestionId }
    ) {
      step {
        ...StepAddedAnalytics
      }
    }
  }
  ${STEP_ADDED_ANALYTICS_FRAGMENT}
`;
