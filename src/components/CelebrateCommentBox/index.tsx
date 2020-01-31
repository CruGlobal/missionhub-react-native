import React, { useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import CommentBox from '../CommentBox';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../actions/celebrateComments';
import { celebrateCommentsCommentSelector } from '../../selectors/celebrateComments';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

interface CelebrateCommentBoxProps {
  event: CelebrateItem;
  organization: Organization;
  editingComment?: CelebrateComment;
  onAddComplete?: () => void;
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const CelebrateCommentBox = ({
  event,
  organization,
  editingComment,
  onAddComplete,
  dispatch,
}: CelebrateCommentBoxProps) => {
  // Make sure we run "cancel" when component unmounts
  useEffect(() => () => cancel(), []);

  const submitComment = async (action: object, text: string) => {
    if (editingComment) {
      cancel();
      return dispatch(
        updateCelebrateComment(
          event.id,
          organization.id,
          editingComment.id,
          text,
        ),
      );
    }
    const results = await dispatch(
      createCelebrateComment(event.id, organization.id, text),
    );
    onAddComplete && onAddComplete();
    return results;
  };

  const cancel = () => {
    dispatch(resetCelebrateEditingComment());
  };

  return (
    <CommentBox
      // @ts-ignore
      testID="CelebrateCommentBox"
      placeholderTextKey={'celebrateCommentBox:placeholder'}
      onSubmit={submitComment}
      hideActions={true}
      editingComment={editingComment}
      onCancel={cancel}
      containerStyle={styles.container}
    />
  );
};
const mapStateToProps = (
  {
    celebrateComments,
  }: {
    celebrateComments: CelebrateCommentsState;
  },
  { event }: { event: CelebrateItem },
) => ({
  editingComment: celebrateCommentsCommentSelector(
    { celebrateComments },
    { eventId: event.id, commentId: celebrateComments.editingCommentId },
  ),
});

export default connect(mapStateToProps)(CelebrateCommentBox);
