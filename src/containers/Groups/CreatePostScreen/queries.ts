import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../../components/CommunityFeedItem/queries';

export const CREATE_POST = gql`
  mutation CreatePost(
    $input: CreatePostInput!
    $commentsCursor: String # not used by this query but needed to make CommunityFeedItemCommentLike.comments fragment happy
  ) {
    createPost(input: $input) {
      post {
        id
        feedItem {
          read
          ...CommunityFeedItem
        }
      }
    }
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      post {
        id
        content
        mediaExpiringUrl
      }
    }
  }
`;
