import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import CommentBox, { ActionItem } from '../CommentBox';

import styles from './styles';
import { FeedItemEditingComment } from './__generated__/FeedItemEditingComment';
import {
  CreateFeedItemComment,
  CreateFeedItemCommentVariables,
} from './__generated__/CreateFeedItemComment';
import {
  CREATE_FEED_ITEM_COMMENT_MUTATION,
  UPDATE_FEED_ITEM_COMMENT_MUTATION,
} from './queries';
import {
  UpdateFeedItemComment,
  UpdateFeedItemCommentVariables,
} from './__generated__/UpdateFeedItemComment';

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
  const [createComment] = useMutation<
    CreateFeedItemComment,
    CreateFeedItemCommentVariables
  >(CREATE_FEED_ITEM_COMMENT_MUTATION);

  const [updateComment] = useMutation<
    UpdateFeedItemComment,
    UpdateFeedItemCommentVariables
  >(UPDATE_FEED_ITEM_COMMENT_MUTATION);

  const submitComment = async (_: ActionItem | null, text: string) => {
    if (editingComment) {
      onCancel();
      await updateComment({
        variables: { commentId: editingComment.id, content: text },
      });
    } else {
      await createComment({
        variables: { feedItemId, content: text },
      });
      onAddComplete();
    }
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
