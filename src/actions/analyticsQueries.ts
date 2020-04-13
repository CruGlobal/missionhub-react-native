import gql from 'graphql-tag';

export const STEP_ADDED_ANALYTICS_FRAGMENT = gql`
  fragment StepAddedAnalytics on Step {
    receiver {
      id
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
