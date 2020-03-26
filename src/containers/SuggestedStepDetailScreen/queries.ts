import gql from 'graphql-tag';

import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../../actions/analyticsQueries';

export const STEP_SUGGESTION_QUERY = gql`
  query StepSuggestion($stepSuggestionId: ID!, $personId: ID!) {
    stepSuggestion(id: $stepSuggestionId) {
      body
      descriptionMarkdown
      stepType
    }
    person(id: $personId) {
      firstName
    }
  }
`;

export const CREATE_STEP_FROM_SUGGESTION_MUTATION = gql`
  mutation CreateStepFromSuggestion(
    $receiverId: ID!
    $communityId: ID
    $stepSuggestionId: ID!
  ) {
    createStep(
      input: {
        title: "Title should be pulled from suggestion after MHP-3274"
        receiverId: $receiverId
        communityId: $communityId
        stepSuggestionId: $stepSuggestionId
      }
    ) {
      step {
        ...StepAddedAnalytics
      }
    }
  }
  ${STEP_ADDED_ANALYTICS_FRAGMENT}
`;
