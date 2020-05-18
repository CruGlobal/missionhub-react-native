import React from 'react';
import { useDispatch } from 'react-redux';

import CommentBox, { ActionItem } from '../CommentBox';

import styles from './styles';
import { FeedItemEditingComment } from './__generated__/FeedItemEditingComment';

interface CelebrateCommentBoxProps {
  feedItemId: string;
  editingComment?: FeedItemEditingComment;
  onAddComplete: () => void;
  onCancel: () => void;
}

const CelebrateCommentBox = ({
  feedItemId,
  editingComment,
  onAddComplete,
  onCancel,
}: CelebrateCommentBoxProps) => {
  const dispatch = useDispatch();

  const submitComment = async (_: ActionItem | null, text: string) => {
    if (editingComment) {
      onCancel();
      return dispatch(
        updateCelebrateComment(
          feedItemId,
          organization.id,
          editingComment.id,
          text,
        ),
      );
    }
    const results = await dispatch(
      createCelebrateComment(feedItemId, organization.id, text),
    );
    onAddComplete();
    return results;
  };

  return (
    <CommentBox
      testID="CelebrateCommentBox"
      placeholderTextKey={'celebrateCommentBox:placeholder'}
      onSubmit={submitComment}
      editingComment={editingComment}
      onCancel={onCancel}
      containerStyle={styles.container}
    />
  );
};

export default CelebrateCommentBox;
