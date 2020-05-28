import React, { useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import { Alert, FlatList } from 'react-native';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useTranslation } from 'react-i18next';

import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
  deleteCelebrateComment,
  setCelebrateEditingComment,
  resetCelebrateEditingComment,
} from '../../actions/celebrateComments';
import { reportComment } from '../../actions/reportComments';
import LoadMore from '../../components/LoadMore';
import { keyExtractorId, isOwner } from '../../utils/common';
import CommentItem from '../CommentItem';
import { orgPermissionSelector } from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { CelebrateItem } from '../../components/CommunityFeedItem/__generated__/CelebrateItem';

import styles from './styles';

export interface CommentsListProps {
  dispatch: ThunkDispatch<
    { auth: AuthState; celebrateComments: CelebrateCommentsState },
    {},
    AnyAction
  >;
  event: CelebrateItem;
  organization: Organization;
  me: Person;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  celebrateComments?: { comments: CelebrateComment[]; pagination: any };
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  listProps: { [key: string]: any };
}

const CommentsList = ({
  dispatch,
  event,
  organization,
  me,
  celebrateComments,
  listProps,
}: CommentsListProps) => {
  const { t } = useTranslation('commentsList');

  useEffect(() => {
    dispatch(reloadCelebrateComments(event.id, organization.id));
    dispatch(resetCelebrateEditingComment());
  }, []);

  const handleLoadMore = () => {
    dispatch(getCelebrateCommentsNextPage(event.id, organization.id));
  };

  const handleEdit = (item: CelebrateComment) => {
    dispatch(setCelebrateEditingComment(item.id));
  };

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

  const handleDelete = (item: CelebrateComment) => {
    alert({
      title: 'deletePostHeader',
      message: 'deleteAreYouSure',
      actionText: 'deletePost',
      action: () => {
        dispatch(deleteCelebrateComment(organization.id, event.id, item.id));
      },
    });
  };

  const handleReport = (item: CelebrateComment) => {
    alert({
      title: 'reportToOwnerHeader',
      message: 'reportAreYouSure',
      actionText: 'reportPost',
      action: () => {
        dispatch(reportComment(organization.id, item));
      },
    });
  };

  const menuActions = (item: CelebrateComment) => {
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

    if (me.id === item.person.id) {
      actions.push({
        text: t('editPost'),
        onPress: () => handleEdit(item),
      });
      actions.push(deleteAction);
    } else {
      const orgPermission =
        orgPermissionSelector(
          {},
          {
            person: me,
            organization,
          },
        ) || {};
      if (isOwner(orgPermission)) {
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

  const renderItem = ({ item }: { item: CelebrateComment }) => (
    <CommentItem
      testID="CommentItem"
      item={item}
      menuActions={menuActions(item)}
      organization={organization}
    />
  );

  const { comments = [], pagination } = celebrateComments || {};
  const { list, listContent } = styles;

  return (
    <FlatList
      data={comments}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      style={list}
      contentContainerStyle={listContent}
      ListFooterComponent={
        pagination &&
        pagination.hasNextPage && (
          <LoadMore testID="LoadMore" onPress={handleLoadMore} />
        )
      }
      bounces={false}
      {...listProps}
    />
  );
};

const mapStateToProps = (
  {
    auth,
    celebrateComments,
  }: { auth: AuthState; celebrateComments: CelebrateCommentsState },
  { event }: { event: CelebrateItem },
) => ({
  me: auth.person,
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
});
export default connect(mapStateToProps)(CommentsList);
