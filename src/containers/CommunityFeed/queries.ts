import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_FRAGMENT } from '../../components/CommunityFeedItem/queries';

export const GET_GLOBAL_COMMUNITY_FEED = gql`
  query GetGlobalCommunityFeed(
    $subjectType: FeedItemSubjectTypeEnum
    $feedItemsCursor: String
    $commentsCursor: String # not used by this query but needed to make CommunityFeedItemCommentLike.comments fragment happy
  ) {
    globalCommunity {
      feedItems(
        subjectType: $subjectType
        sortBy: createdAt_DESC
        after: $feedItemsCursor
        first: 25
      ) {
        nodes {
          read
          ...CommunityFeedItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
`;

export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed(
    $communityId: ID!
    $subjectType: [FeedItemSubjectTypeEnum!] = [
      STORY
      QUESTION
      PRAYER_REQUEST
      ANNOUNCEMENT
      HELP_REQUEST
      THOUGHT
      STEP
      ACCEPTED_COMMUNITY_CHALLENGE
      COMMUNITY_PERMISSION
    ]
    $personIds: [ID!]
    $feedItemsCursor: String
    $commentsCursor: String # not used by this query but needed to make CommunityFeedItemCommentLike.comments fragment happy
  ) {
    community(id: $communityId) {
      id
      name
      feedItems(
        subjectType: $subjectType
        subjectPersonIds: $personIds
        sortBy: createdAt_DESC
        after: $feedItemsCursor
        first: 25
      ) {
        nodes {
          read
          ...CommunityFeedItem
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_FEED_ITEM_FRAGMENT}
`;
