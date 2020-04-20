import gql from 'graphql-tag';

export const COMPLETED_STEP_DETAIL_QUERY = gql`
  query CompletedStepDetail($id: ID!) {
    step(id: $id) {
      id
      title
      completedAt
      stepType
      stepSuggestion {
        descriptionMarkdown
      }
      receiver {
        id
        firstName
      }
    }
  }
`;
