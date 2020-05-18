import React from 'react';
import { Alert, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import LoadMore from '../../components/LoadMore';
import { keyExtractorId } from '../../utils/common';
import CommentItem from '../CommentItem';
import { useMyId } from '../../utils/hooks/useIsMe';

import styles from './styles';
import {
  FeedItemCommentConnection,
  FeedItemCommentConnection_nodes,
} from './__generated__/FeedItemCommentConnection';

export interface CommentsListProps {
  commentsConnection: FeedItemCommentConnection;
  editingCommentId?: string;
  setEditingCommentId: (id?: string) => void;
  isOwner: boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  listProps: { [key: string]: any };
}

const CommentsList = ({
  commentsConnection,
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

  const handleDelete = (item: FeedItemCommentConnection_nodes) => {
    alert({
      title: 'deletePostHeader',
      message: 'deleteAreYouSure',
      actionText: 'deletePost',
      action: () => {
        dispatch(deleteCelebrateComment(organization.id, event.id, item.id));
      },
    });
  };

  const handleReport = (item: FeedItemCommentConnection_nodes) => {
    alert({
      title: 'reportToOwnerHeader',
      message: 'reportAreYouSure',
      actionText: 'reportPost',
      action: () => {
        dispatch(reportComment(organization.id, item));
      },
    });
  };

  const menuActions = (item: FeedItemCommentConnection_nodes) => {
    const actions: {
      text: string;
      onPress: () => void;
      destructive?: boolean;
    }[] = [];

    const deleteAction = {
      text: t('deletePost'),
      onPress: () => handleDelete(item),
      destructive: true,
    };

    if (myId === item.person.id) {
      actions.push({
        text: t('editPost'),
        onPress: () => setEditingCommentId(item.id),
      });
      actions.push(deleteAction);
    } else {
      if (isOwner) {
        actions.push(deleteAction);
      } else {
        actions.push({
          text: t('reportToOwner'),
          onPress: () => handleReport(item),
        });
      }
    }

    return actions;
  };

  const renderItem = ({
    item: comment,
  }: {
    item: FeedItemCommentConnection_nodes;
  }) => (
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
      data={commentsConnection.nodes}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      style={list}
      contentContainerStyle={listContent}
      ListFooterComponent={
        // TODO: add infinite scroll
        commentsConnection.pageInfo.hasNextPage ? (
          <LoadMore testID="LoadMore" onPress={handleLoadMore} />
        ) : null
      }
      bounces={false}
      {...listProps}
    />
  );
};

export default CommentsList;
