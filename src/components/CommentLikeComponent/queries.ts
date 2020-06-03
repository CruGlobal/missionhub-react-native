import gql from 'graphql-tag';

export const COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT = gql`
  fragment CommunityFeedItemCommentLike on FeedItem {
    id
    comments(after: $commentsCursor) {
      pageInfo {
        totalCount
      }
    }
    liked
    likesCount
    subject {
      __typename
      ... on Post {
        id
        postType
      }
    }
    subjectPerson {
      id
    }
  }
`;

export const SET_FEED_ITEM_LIKE_MUTATION = gql`
  mutation SetFeedItemLike($id: ID!, $liked: Boolean!) {
    setFeedItemLike(input: { id: $id, status: $liked }) {
      feedItem {
        id
        liked
        likesCount
      }
    }
  }
`;
