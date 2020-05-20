import React, { useEffect, useState } from 'react';
import { View, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Separator, Touchable, Icon, Text } from '../common';
import CardTime from '../CardTime';
import { CommunityFeedItemContent } from '../CommunityFeedItemContent';
import Avatar from '../Avatar';
import { CommentLikeComponent } from '../CommentLikeComponent';
import { CommunityFeedItemName } from '../CommunityFeedItemName';
import PostTypeLabel from '../PostTypeLabel';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { CREATE_POST_SCREEN } from '../../containers/Groups/CreatePostScreen';
import { orgIsGlobal, getFeedItemType } from '../../utils/common';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { GlobalCommunityFeedItem } from '../CommunityFeedItem/__generated__/GlobalCommunityFeedItem';
import {
  CommunityFeedItem as FeedItemFragment,
  CommunityFeedItem_subject,
} from '../CommunityFeedItem/__generated__/CommunityFeedItem';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../../containers/CelebrateFeedWithType';
import { ADD_POST_TO_STEPS_SCREEN } from '../../containers/AddPostToStepsScreen';

import PlusIcon from './plusIcon.svg';
import StepIcon from './stepIcon.svg';
import styles from './styles';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { DELETE_POST, REPORT_POST } from './queries';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';
import { CommunityFeedPost } from './__generated__/CommunityFeedPost';

export type CombinedFeedItem = FeedItemFragment & GlobalCommunityFeedItem;

export interface CommunityFeedItemProps {
  item: CombinedFeedItem;
  communityId: string;
  namePressable: boolean;
  onClearNotification?: (item: CombinedFeedItem) => void;
  onRefresh: () => void;
}

export const CommunityFeedItem = ({
  item,
  communityId,
  namePressable,
  onClearNotification,
  onRefresh,
}: CommunityFeedItemProps) => {
  const { createdAt, subject, subjectPerson, subjectPersonName } = item;
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();
  const isMe = useIsMe(subjectPerson?.id || '');
  const [deletePost] = useMutation<DeletePost, DeletePostVariables>(
    DELETE_POST,
  );
  const [reportPost] = useMutation<ReportPost, ReportPostVariables>(
    REPORT_POST,
  );
  const [imageAspectRatio, changeImageAspectRatio] = useState(2);

  const FeedItemType = getFeedItemType(subject);

  const addToSteps = [
    FeedItemSubjectTypeEnum.HELP_REQUEST,
    FeedItemSubjectTypeEnum.PRAYER_REQUEST,
    FeedItemSubjectTypeEnum.QUESTION,
  ].includes(FeedItemType);
  const isGlobal = orgIsGlobal({ id: communityId });

  const isPost = (
    subject: CommunityFeedItem_subject,
  ): subject is CommunityFeedPost => subject.__typename === 'Post';

  const imageData = (isPost(subject) && subject.mediaExpiringUrl) || null;

  useEffect(() => {
    if (!imageData) {
      return;
    }

    Image.getSize(
      imageData,
      (width, height) => changeImageAspectRatio(width / height),
      () => {},
    );
  }, [imageData]);

  const handlePress = () =>
    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        item,
        orgId: communityId,
        onRefreshCelebrateItem: onRefresh,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(item);

  const handleEdit = () =>
    dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        post: subject,
        onComplete: onRefresh,
        communityId,
      }),
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

  const handleAddToMySteps = () =>
    dispatch(
      navigatePush(ADD_POST_TO_STEPS_SCREEN, {
        item,
        communityId,
      }),
    );

  const navToFilteredFeed = () => {
    dispatch(
      navigatePush(CELEBRATE_FEED_WITH_TYPE_SCREEN, {
        type: FeedItemType,
        communityId,
      }),
    );
  };

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

  const renderAddToStepsButton = () => (
    <Touchable
      style={styles.addStepWrap}
      onPress={handleAddToMySteps}
      testID="AddToMyStepsButton"
    >
      <StepIcon style={styles.stepIcon} />
      <PlusIcon style={styles.plusIcon} />
      <Text style={styles.addStepText}>{t('addToMySteps')}</Text>
    </Touchable>
  );

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

  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <PostTypeLabel type={FeedItemType} onPress={navToFilteredFeed} />
      </View>
      <View style={styles.headerRow}>
        <Avatar size="medium" person={subjectPerson} orgId={communityId} />
        <View style={styles.headerNameWrapper}>
          <CommunityFeedItemName
            name={subjectPersonName}
            person={subjectPerson}
            communityId={communityId}
            pressable={namePressable}
          />
          <CardTime date={createdAt} style={styles.headerTime} />
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerWrap}>
      {addToSteps ? renderAddToStepsButton() : null}
      <View style={styles.commentLikeWrap}>
        <CommentLikeComponent
          item={item}
          communityId={communityId}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={styles.cardContent}>
      {renderHeader()}
      <CommunityFeedItemContent
        item={item}
        communityId={communityId}
        style={styles.postTextWrap}
      />
      {imageData ? (
        <Image
          source={{ uri: imageData }}
          style={{ aspectRatio: imageAspectRatio }}
          resizeMode="contain"
        />
      ) : null}
      <Separator />
      {renderFooter()}
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