import gql from 'graphql-tag';

export const COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT = gql`
  fragment CommunityFeedItemCommentLike on FeedItem {
    id
    comments {
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
