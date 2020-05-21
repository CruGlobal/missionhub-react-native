import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import CommentBox, {
  ActionItem,
} from '../../../../../../components/CommentBox';

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
import { useTranslation } from 'react-i18next';

interface FeedCommentBoxProps {
  feedItemId: string;
  editingComment?: FeedItemEditingComment;
  onAddComplete: () => void;
  onCancel: () => void;
}

const FeedCommentBox = ({
  feedItemId,
  editingComment,
  onAddComplete,
  onCancel,
}: FeedCommentBoxProps) => {
  const { t } = useTranslation('feedCommentBox');

  const [createComment] = useMutation<
    CreateFeedItemComment,
    CreateFeedItemCommentVariables
  >(CREATE_FEED_ITEM_COMMENT_MUTATION);

  const [updateComment] = useMutation<
    UpdateFeedItemComment,
    UpdateFeedItemCommentVariables
  >(UPDATE_FEED_ITEM_COMMENT_MUTATION);

  const submitComment = async (text: string) => {
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
      testID="FeedCommentBox"
      placeholderText={t('placeholder')}
      onSubmit={submitComment}
      editingComment={editingComment}
      onCancel={onCancel}
    />
  );
};

export default FeedCommentBox;
