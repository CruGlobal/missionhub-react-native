import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT } from '../CommunityFeedItemContent/queries';

export const COMMUNITY_FEED_ITEM_FRAGMENT = gql`
  fragment CommunityFeedItem on FeedItem {
    id
    createdAt
    subjectEvent
    subject {
      __typename
      ... on AcceptedCommunityChallenge {
        id
      }
      ... on Step {
        id
        receiverStageAtCompletion {
          id
        }
      }
      ... on Post {
        id
      }
    }
    subjectPerson {
      id
    }
    community {
      id
      name
    }
    ...CommunityFeedItemContent
  }
  ${COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(input: { id: $id }) {
      id
    }
  }
`;

export const REPORT_POST = gql`
  mutation ReportPost($id: ID!) {
    createContentComplaint(input: { subjectId: $id, subjectType: Post }) {
      contentComplaint {
        id
      }
    }
  }
`;
