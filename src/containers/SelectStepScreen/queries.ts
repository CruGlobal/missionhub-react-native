import gql from 'graphql-tag';

export const STEP_SUGGESTIONS_QUERY = gql`
  query StepSuggestions(
    $personId: ID!
    $stepType: StepTypeEnum
    $after: String
    $seed: Float
  ) {
    person(id: $personId) {
      firstName
      stepSuggestions(
        stepType: $stepType
        first: 10
        after: $after
        sortBy: random
        seed: $seed
      ) {
        nodes {
          id
          body
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const STEP_TYPE_COUNTS_QUERY = gql`
  query StepTypeCounts($personId: ID!) {
    completedStepsReport(personId: $personId, period: "P99Y") {
      count
      stepType
    }
  }
`;

export const STEP_EXPLAINER_MODAL_VIEWED = gql`
  query StepExplainerModalViewed {
    viewedState @client {
      stepExplainerModal
    }
  }
`;
