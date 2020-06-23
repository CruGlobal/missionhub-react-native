import gql from 'graphql-tag';

export const STEP_ADDED_ANALYTICS_FRAGMENT = gql`
  fragment StepAddedAnalytics on Step {
    id
    title
    receiver {
      id
    }
    post {
      id
      postType
      stepStatus
    }
    stepType
    stepSuggestion {
      id
      stage {
        id
      }
    }
  }
`;
