import gql from 'graphql-tag';

export const ADD_POST_TO_MY_STEPS = gql`
  mutation AddPostToMySteps($input: AddPostToMyStepsInput!) {
    addPostToMySteps(input: $input) {
      step {
        id
        title
      }
    }
  }
`;
