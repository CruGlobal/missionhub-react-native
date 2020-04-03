import gql from 'graphql-tag';

export const CREATE_POST = gql`
  mutation CreatePost($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        id
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdateStoryInput!) {
    updateStory(input: $input) {
      story {
        id
      }
    }
  }
`;
