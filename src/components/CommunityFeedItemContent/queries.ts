import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT } from '../CommentLikeComponent/queries';

export const COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT = gql`
  fragment CommunityFeedItemContent on FeedItem {
    id
    createdAt
    subject {
      __typename
      ... on AcceptedCommunityChallenge {
        id
        communityChallenge {
          id
          title
        }
        completedAt
      }
      ... on Step {
        id
        receiverStageAtCompletion {
          id
        }
      }
      ... on Post {
        id
        content
        mediaExpiringUrl
        stepStatus
      }
    }
    subjectPerson {
      id
      firstName
      lastName
      fullName
      picture
    }
    community {
      id
      name
      communityPhotoUrl
    }
    subjectPersonName
    ...CommunityFeedItemCommentLike
  }
  ${COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT}
`;
