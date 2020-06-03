import gql from 'graphql-tag';

export { FEED_ITEM_COMMENT_ITEM_FRAGMENT } from '../CommentItem/queries';

export const DELETE_FEED_ITEM_COMMENT_MUTATION = gql`
  mutation DeleteFeedItemComment($id: ID!) {
    deleteFeedItemComment(input: { id: $id }) {
      id
    }
  }
`;

export const REPORT_FEED_ITEM_COMMENT_MUTATION = gql`
  mutation ReportFeedItemComment($id: ID!) {
    createContentComplaint(
      input: { subjectId: $id, subjectType: CommunityCelebrationItemComment }
    ) {
      contentComplaint {
        id
      }
    }
  }
`;
