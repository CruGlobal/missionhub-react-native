import React from 'react';
import { Alert, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { keyExtractorId, copyText } from '../../utils/common';
import CommentItem from '../CommentItem';
import { useMyId } from '../../utils/hooks/useIsMe';
import { FeedItemCommentItem } from '../CommentItem/__generated__/FeedItemCommentItem';
import {
  FeedItemDetail,
  FeedItemDetailVariables,
} from '../Communities/Community/CommunityFeedTab/FeedItemDetailScreen/__generated__/FeedItemDetail';
import { FEED_ITEM_DETAIL_QUERY } from '../Communities/Community/CommunityFeedTab/FeedItemDetailScreen/queries';

import styles from './styles';
import {
  DELETE_FEED_ITEM_COMMENT_MUTATION,
  REPORT_FEED_ITEM_COMMENT_MUTATION,
} from './queries';
import {
  DeleteFeedItemComment,
  DeleteFeedItemCommentVariables,
} from './__generated__/DeleteFeedItemComment';
import {
  ReportFeedItemComment,
  ReportFeedItemCommentVariables,
} from './__generated__/ReportFeedItemComment';

interface CommentsListProps {
  feedItemId: string;
  comments: FeedItemCommentItem[];
  editingCommentId?: string;
  setEditingCommentId: (id?: string) => void;
  isOwner: boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  listProps: { [key: string]: any };
}

const CommentsList = ({
  feedItemId,
  comments,
  editingCommentId,
  setEditingCommentId,
  isOwner,
  listProps,
}: CommentsListProps) => {
  const { t } = useTranslation('commentsList');
  const myId = useMyId();

  const alert = ({
    title,
    message,
    actionText,
    action,
  }: {
    title: string;
    message: string;
    actionText: string;
    action: () => void;
  }) => {
    Alert.alert(t(title), t(message), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t(actionText),
        onPress: action,
      },
    ]);
  };

  const [deleteComment] = useMutation<
    DeleteFeedItemComment,
    DeleteFeedItemCommentVariables
  >(DELETE_FEED_ITEM_COMMENT_MUTATION, {
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
              nodes: (originalData?.feedItem.comments.nodes || []).filter(
                ({ id }) => id !== data?.deleteFeedItemComment?.id,
              ),
              pageInfo: {
                ...originalData?.feedItem.comments.pageInfo,
                totalCount:
                  originalData?.feedItem?.comments?.pageInfo?.totalCount ===
                  undefined
                    ? undefined
                    : originalData?.feedItem?.comments?.pageInfo?.totalCount -
                      1,
              },
            },
          },
        },
      });
    },
  });

  const handleDelete = (commentId: string) => {
    alert({
      title: 'deleteCommentHeader',
      message: 'deleteAreYouSure',
      actionText: 'deleteComment',
      action: () => deleteComment({ variables: { id: commentId } }),
    });
  };

  const [reportComment] = useMutation<
    ReportFeedItemComment,
    ReportFeedItemCommentVariables
  >(REPORT_FEED_ITEM_COMMENT_MUTATION);

  const handleReport = (commentId: string) => {
    alert({
      title: 'reportToOwnerHeader',
      message: 'reportAreYouSure',
      actionText: 'reportComment',
      action: () => reportComment({ variables: { id: commentId } }),
    });
  };

  const handleCopyPost = (commentText: string) => copyText(commentText);

  const menuActions = (comment: FeedItemCommentItem) => {
    const actions: {
      text: string;
      onPress: () => void;
      destructive?: boolean;
    }[] = [];

    const deleteAction = {
      text: t('deleteComment'),
      onPress: () => handleDelete(comment.id),
      destructive: true,
    };

    actions.push({
      text: t('communityFeedItems:copy.buttonText'),
      onPress: () => handleCopyPost(comment.content),
    });

    if (myId === comment.person.id) {
      actions.push({
        text: t('editComment'),
        onPress: () => setEditingCommentId(comment.id),
      });
      actions.push(deleteAction);
    } else {
      if (isOwner) {
        actions.push(deleteAction);
      } else {
        actions.push({
          text: t('reportToOwner'),
          onPress: () => handleReport(comment.id),
        });
      }
    }

    return actions;
  };

  const renderItem = ({ item: comment }: { item: FeedItemCommentItem }) => (
    <CommentItem
      testID="CommentItem"
      comment={comment}
      menuActions={menuActions(comment)}
      isEditing={comment.id === editingCommentId}
    />
  );

  const { list, listContent } = styles;

  return (
    <FlatList
      data={comments}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      style={list}
      contentContainerStyle={listContent}
      bounces={false}
      {...listProps}
    />
  );
};

export default CommentsList;
