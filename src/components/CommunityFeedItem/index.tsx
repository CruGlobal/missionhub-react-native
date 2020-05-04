import React, { useMemo, useState } from 'react';
import { View, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import GLOBAL_COMMUNITY_IMAGE from '../../../assets/images/globalCommunityImage.png';
import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { CardHorizontalMargin } from '../Card/styles';
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
import { CommunityFeedItem as FeedItemFragment } from '../CommunityFeedItem/__generated__/CommunityFeedItem';
import { FeedItemSubjectTypeEnum } from '../../../__generated__/globalTypes';
import { GetCommunities_communities_nodes } from '../../containers/Groups/__generated__/GetCommunities';
import theme from '../../theme';

import PlusIcon from './plusIcon.svg';
import StepIcon from './stepIcon.svg';
import styles from './styles';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { DELETE_POST, REPORT_POST } from './queries';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';
import { CommunityFeedPost } from './__generated__/CommunityFeedPost';

const cardWidth = theme.fullWidth - CardHorizontalMargin * 2;

export interface CommunityFeedItemProps {
  item: FeedItemFragment;
  organization: GetCommunities_communities_nodes;
  namePressable: boolean;
  onClearNotification?: (item: FeedItemFragment) => void;
  onRefresh: () => void;
}

export const CommunityFeedItem = ({
  item,
  organization,
  namePressable,
  onClearNotification,
  onRefresh,
}: CommunityFeedItemProps) => {
  const { createdAt, subject, subjectPerson, subjectPersonName } = item;
  const personId = subjectPerson?.id;
  const orgId = organization.id;

  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();
  const isMe = useIsMe(personId || '');
  const [deletePost] = useMutation<DeletePost, DeletePostVariables>(
    DELETE_POST,
  );
  const [reportPost] = useMutation<ReportPost, ReportPostVariables>(
    REPORT_POST,
  );
  const [imageHeight, changeImageHeight] = useState<number>(0);

  const FeedItemType = getFeedItemType(subject);

  const isPost = subject.__typename === 'Post';
  const addToSteps = [
    FeedItemSubjectTypeEnum.HELP_REQUEST,
    FeedItemSubjectTypeEnum.PRAYER_REQUEST,
    FeedItemSubjectTypeEnum.QUESTION,
  ].includes(FeedItemType);
  const isGlobal = orgIsGlobal(organization);

  const imageData =
    (isPost && (subject as CommunityFeedPost).mediaExpiringUrl) || null;
  useMemo(() => {
    if (!imageData) {
      return changeImageHeight(0);
    }

    Image.getSize(
      imageData,
      (width, height) => changeImageHeight((height * theme.fullWidth) / width),
      () => {},
    );
  }, [imageData]);

  const handlePress = () =>
    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        item,
        orgId,
        onRefreshCelebrateItem: onRefresh,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(item);

  const handleEdit = () =>
    dispatch(
      navigatePush(CREATE_POST_SCREEN, {
        post: item.subject,
        onComplete: onRefresh,
        communityId: orgId,
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

  const handleAddToMySteps = () => {
    //TODO: add to my steps
  };

  const menuActions =
    !isGlobal && isPost
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
      : null;

  const renderAddToStepsButton = () => (
    <Touchable style={styles.addStepWrap} onPress={handleAddToMySteps}>
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
        <PostTypeLabel type={FeedItemType} />
      </View>
      <View style={styles.headerRow}>
        {personId ? (
          <Avatar size={'medium'} person={subjectPerson} orgId={orgId} />
        ) : null}
        <View style={styles.headerNameWrapper}>
          <CommunityFeedItemName
            name={subjectPersonName}
            personId={personId}
            orgId={orgId}
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
          orgId={organization.id}
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
        organization={organization}
        style={styles.postTextWrap}
      />
      {imageData ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image
            source={{ uri: imageData }}
            style={{ width: cardWidth, height: imageHeight }}
            resizeMode="contain"
          />
        </View>
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
          // @ts-ignore
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
    : menuActions
    ? renderCardLongPressable()
    : renderCardPressable();
};
