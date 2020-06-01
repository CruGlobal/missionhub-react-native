import gql from 'graphql-tag';

export const FEED_ITEM_POST_CARD_FRAGMENT = gql`
  fragment FeedItemPostCard on Post {
    id
    __typename
    postType
    author {
      id
      fullName
      firstName
      picture
    }
  }
`;
export const FEED_ITEM_STEP_CARD_FRAGMENT = gql`
  fragment FeedItemStepCard on Step {
    id
    __typename
    owner {
      id
      fullName
      firstName
      picture
    }
  }
`;

export const GET_COMMUNITY_POST_CARDS = gql`
  query GetCommunityPostCards($communityId: ID!) {
    community(id: $communityId) {
      id
      feedItems(sortBy: createdAt_DESC, first: 100, unread: true) {
        nodes {
          subject {
            ... on Step {
              ...FeedItemStepCard
            }
            ... on Post {
              ...FeedItemPostCard
            }
          }
        }
      }
    }
  }
  ${FEED_ITEM_POST_CARD_FRAGMENT}
  ${FEED_ITEM_STEP_CARD_FRAGMENT}
`;

export const MARK_COMMUNITY_FEED_ITEMS_READ = gql`
  mutation MarkCommunityFeedItemsRead(
    $input: MarkCommunityFeedItemsAsReadInput!
  ) {
    markCommunityFeedItemsAsRead(input: $input) {
      community {
        id
      }
    }
  }
`;
