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
