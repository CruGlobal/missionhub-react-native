import React, { forwardRef, Ref } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import CommentBox, {
  CommentBoxHandles,
} from '../../../../../../components/CommentBox';
import { AvatarPerson } from '../../../../../../components/Avatar';
import {
  FeedItemDetail,
  FeedItemDetailVariables,
} from '../__generated__/FeedItemDetail';
import { FEED_ITEM_DETAIL_QUERY } from '../queries';
import { useMyId } from '../../../../../../utils/hooks/useIsMe';

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

interface FeedCommentBoxProps {
  avatarPerson: AvatarPerson;
  feedItemId: string;
  editingComment?: FeedItemEditingComment;
  onAddComplete?: () => void;
  onCancel: () => void;
  onFocus?: () => void;
}

const FeedCommentBox = forwardRef(
  (
    {
      avatarPerson,
      feedItemId,
      editingComment,
      onAddComplete,
      onCancel,
      onFocus,
    }: FeedCommentBoxProps,
    ref: Ref<CommentBoxHandles>,
  ) => {
    const { t } = useTranslation('feedCommentBox');
    const myId = useMyId();

    const [createComment] = useMutation<
      CreateFeedItemComment,
      CreateFeedItemCommentVariables
    >(CREATE_FEED_ITEM_COMMENT_MUTATION, {
      update: (cache, { data }) => {
        const originalData = cache.readQuery<
          FeedItemDetail,
          FeedItemDetailVariables
        >({
          query: FEED_ITEM_DETAIL_QUERY,
          variables: { feedItemId, myId },
        });
        cache.writeQuery({
          query: FEED_ITEM_DETAIL_QUERY,
          data: {
            ...originalData,
            feedItem: {
              ...originalData?.feedItem,
              comments: {
                ...originalData?.feedItem.comments,
                nodes: [
                  ...(originalData?.feedItem.comments.nodes || []),
                  data?.createFeedItemComment?.feedItemComment,
                ],
                pageInfo: {
                  ...originalData?.feedItem.comments.pageInfo,
                  totalCount:
                    originalData?.feedItem?.comments?.pageInfo?.totalCount ===
                    undefined
                      ? undefined
                      : originalData?.feedItem?.comments?.pageInfo?.totalCount +
                        1,
                },
              },
            },
          },
        });
      },
    });

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
        onAddComplete && onAddComplete();
      }
    };

    return (
      <CommentBox
        ref={ref}
        testID="FeedItemCommentBox"
        avatarPerson={avatarPerson}
        placeholderText={t('placeholder')}
        onSubmit={submitComment}
        editingComment={editingComment}
        onCancel={onCancel}
        onFocus={onFocus}
      />
    );
  },
);

export default FeedCommentBox;
