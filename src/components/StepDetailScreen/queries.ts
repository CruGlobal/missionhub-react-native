import gql from 'graphql-tag';

export const STEP_DETAIL_POST_FRAGMENT = gql`
  fragment StepDetailPost on Post {
    id
    author {
      id
      fullName
      picture
    }
    feedItem {
      id
      community {
        id
      }
    }
    content
    createdAt
    mediaExpiringUrl
  }
`;
