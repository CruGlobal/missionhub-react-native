import gql from 'graphql-tag';

import { FEED_ITEM_COMMENT_ITEM_FRAGMENT } from '../CommentItem/queries';
import { COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT } from '../../components/CommunityFeedItemContent/queries';

export const REPORTED_ITEM_FRAGMENT = gql`
  fragment ReportedItem on ContentComplaintGroup {
    __typename
    id
    people {
      nodes {
        id
        fullName
      }
    }
    subject {
      __typename
      ... on FeedItemComment {
        ...FeedItemCommentItem
      }
      ... on Post {
        id
        author {
          id
          fullName
          picture
        }
        content
        mediaExpiringUrl
        feedItem {
          ...CommunityFeedItemContent
        }
      }
    }
  }
  ${FEED_ITEM_COMMENT_ITEM_FRAGMENT}
  ${COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT}
`;

export const RESPOND_TO_CONTENT_COMPLAINT_GROUP = gql`
  mutation RespondToContentComplaintGroup(
    $input: RespondToContentComplaintGroupInput!
  ) {
    respondToContentComplaintGroup(input: $input) {
      subject {
        ... on FeedItemComment {
          id
        }

        ... on Post {
          id
        }
      }
    }
  }
`;
