import gql from 'graphql-tag';

import { COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT } from '../../../../../components/CommunityFeedItemContent/queries';
import { FEED_ITEM_COMMENTS_FRAGMENT } from '../../../../CommentsList/queries';
import { FEED_ITEM_EDITING_COMMENT_FRAGMENT } from '../../../../../components/CelebrateCommentBox/queries';

export const FEED_ITEM_DETAIL_QUERY = gql`
  query FeedItemDetail ($feedItemId: ID!, $myId:ID!) {
    feedItem(id: $feedItemId) @client{ #TODO remove client
      id 
      ...CommunityFeedItemContent
      comments{
        nodes {
          id
          ...FeedItemEditingComment
        }
        ...FeedItemCommentConnection
      }
      community{
        id
        name
        people(personIds: [$myId]){
          edges {
            communityPermission{
              permission
            }
          }
        }
      }
    }
    ${COMMUNITY_FEED_ITEM_CONTENT_FRAGMENT}
    ${FEED_ITEM_COMMENTS_FRAGMENT}
    ${FEED_ITEM_EDITING_COMMENT_FRAGMENT}
  }
`;
