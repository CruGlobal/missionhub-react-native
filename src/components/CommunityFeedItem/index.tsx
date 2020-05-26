import React from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Touchable, Icon } from '../common';
import { CommunityFeedItemContent } from '../CommunityFeedItemContent';
import {
  CREATE_POST_SCREEN,
  CreatePostScreenNavParams,
} from '../../containers/Groups/CreatePostScreen';
import { useIsMe } from '../../utils/hooks/useIsMe';
import {
  CommunityFeedItem as FeedItemFragment,
  CommunityFeedItem_subject,
  CommunityFeedItem_subject_Post,
} from '../CommunityFeedItem/__generated__/CommunityFeedItem';
import { FEED_ITEM_DETAIL_SCREEN } from '../../containers/Communities/Community/CommunityFeed/FeedItemDetailScreen/FeedItemDetailScreen';

import styles from './styles';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { DELETE_POST, REPORT_POST } from './queries';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';

export interface CommunityFeedItemProps {
  feedItem: FeedItemFragment;
  namePressable: boolean;
  onClearNotification?: (item: FeedItemFragment) => void;
  onRefresh: () => void;
}

export const CommunityFeedItem = ({
  feedItem,
  namePressable,
  onClearNotification,
  onRefresh,
}: CommunityFeedItemProps) => {
  const { subject, subjectPerson } = feedItem;
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();
  const isMe = useIsMe(subjectPerson?.id || '');
  const [deletePost] = useMutation<DeletePost, DeletePostVariables>(
    DELETE_POST,
  );
  const [reportPost] = useMutation<ReportPost, ReportPostVariables>(
    REPORT_POST,
  );

  const isGlobal = !feedItem.community;

  const isPost = (
    subject: CommunityFeedItem_subject,
  ): subject is CommunityFeedItem_subject_Post => subject.__typename === 'Post';

  const handlePress = () =>
    dispatch(
      navigatePush(FEED_ITEM_DETAIL_SCREEN, {
        feedItemId: feedItem.id,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(feedItem);

  const handleEdit = () =>
    dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        post: subject,
        onComplete: onRefresh,
        communityId: feedItem.community?.id,
      } as CreatePostScreenNavParams),
    );

  const handleDelete = () =>
    Alert.alert(t('delete.title'), t('delete.message'), [
      { text: t('cancel') },
      {
        text: t('delete.buttonText'),
        onPress: async () => {
          await deletePost({ variables: { id: subject.id } });
          onRefresh();
        },
      },
    ]);

  const handleReport = () =>
    Alert.alert(t('report.title'), t('report.message'), [
      { text: t('cancel') },
      {
        text: t('report.confirmButtonText'),
        onPress: () => reportPost({ variables: { id: subject.id } }),
      },
    ]);

  const menuActions =
    !isGlobal && isPost(subject)
      ? isMe
        ? [
            {
              text: t('edit.buttonText'),
              onPress: () => handleEdit(),
            },
            {
              text: t('delete.buttonText'),
              onPress: () => handleDelete(),
            },
          ]
        : [
            {
              text: t('report.buttonText'),
              onPress: () => handleReport(),
            },
          ]
      : [];

  const renderClearNotificationButton = () => (
    <View style={styles.clearNotificationWrap}>
      <Touchable
        testID="ClearNotificationButton"
        onPress={clearNotification}
        style={styles.clearNotificationTouchable}
      >
        <Icon
          name="deleteIcon"
          type="MissionHub"
          size={10}
          style={styles.clearNotificationIcon}
        />
      </Touchable>
    </View>
  );

  const renderContent = () => (
    <View style={styles.cardContent}>
      <CommunityFeedItemContent
        feedItem={feedItem}
        namePressable={namePressable}
      />
      {onClearNotification ? renderClearNotificationButton() : null}
    </View>
  );

  const renderCardGlobal = () => (
    <Card testID="CommunityFeedItem">{renderContent()}</Card>
  );

  const renderCardLongPressable = () => (
    <Card>
      <View style={{ flex: 1 }}>
        <PopupMenu
          testID="CommunityFeedItem"
          actions={menuActions}
          buttonProps={{
            onPress: handlePress,
            style: { flex: 1 },
          }}
          triggerOnLongPress={true}
        >
          {renderContent()}
        </PopupMenu>
      </View>
    </Card>
  );

  const renderCardPressable = () => (
    <Card testID="CommunityFeedItem" onPress={handlePress}>
      {renderContent()}
    </Card>
  );

  return isGlobal
    ? renderCardGlobal()
    : menuActions.length
    ? renderCardLongPressable()
    : renderCardPressable();
};
