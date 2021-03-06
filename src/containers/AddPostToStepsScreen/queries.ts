import gql from 'graphql-tag';

import { STEP_DETAIL_POST_FRAGMENT } from '../../components/StepDetailScreen/queries';
import { STEP_ADDED_ANALYTICS_FRAGMENT } from '../../actions/analyticsQueries';

export const ADD_POST_TO_MY_STEPS_SCREEN_DETAILS_QUERY = gql`
  query AddPostToMyStepsScreenDetails($feedItemId: ID!) {
    feedItem(id: $feedItemId) {
      id
      createdAt
      subject {
        ... on Post {
          id
          postType
          stepStatus
          ...StepDetailPost
        }
      }
      subjectPerson {
        id
        firstName
        lastName
      }
    }
  }
  ${STEP_DETAIL_POST_FRAGMENT}
`;

export const ADD_POST_TO_MY_STEPS = gql`
  mutation AddPostToMySteps($input: AddPostToMyStepsInput!) {
    addPostToMySteps(input: $input) {
      step {
        ...StepAddedAnalytics
      }
    }
  }
  ${STEP_ADDED_ANALYTICS_FRAGMENT}
`;
