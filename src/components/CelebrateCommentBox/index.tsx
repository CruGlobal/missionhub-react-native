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
import { CelebrateCommentsState } from '../../reducers/celebrateComments';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

import styles from './styles';

interface CelebrateCommentBoxProps {
  event: GetCelebrateFeed_community_celebrationItems_nodes;
  editingComment?: object;
  onAddComplete?: () => void;
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const CelebrateCommentBox = ({
  event,
  editingComment,
  onAddComplete,
  dispatch,
}: CelebrateCommentBoxProps) => {
  // Make sure we run "cancel" when component unmounts
  useEffect(() => () => cancel(), []);

  const submitComment = async (action: object, text: string) => {
    if (editingComment) {
      cancel();
      return dispatch(updateCelebrateComment(editingComment, text));
    }
    const results = await dispatch(createCelebrateComment(event, text));
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
  { event }: { event: GetCelebrateFeed_community_celebrationItems_nodes },
) => ({
  editingComment: celebrateCommentsCommentSelector(
    { celebrateComments },
    { eventId: event.id, commentId: celebrateComments.editingCommentId },
  ),
});

export default connect(mapStateToProps)(CelebrateCommentBox);
