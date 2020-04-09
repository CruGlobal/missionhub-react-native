import React from 'react';
import {
  View,
  Alert,
  Image,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import STEP_ICON from '../../../assets/images/stepIcon.png';
import PLUS_ICON from '../../../assets/images/plusIcon.png';
import GLOBAL_COMMUNITY_IMAGE from '../../../assets/images/globalCommunityImage.png';
import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Separator, Touchable, Icon, Text } from '../common';
import CardTime from '../CardTime';
import { PersonAvatar } from '../PersonAvatar';
import CelebrateItemContent from '../CelebrateItemContent';
import { CommentLikeComponent } from '../../containers/CommentLikeComponent';
import { CommunityFeedItemName } from '../../containers/CelebrateItemName';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { CELEBRATE_EDIT_STORY_SCREEN } from '../../containers/Groups/EditStoryScreen';
import { useIsMe } from '../../utils/hooks/useIsMe';
import theme from '../../theme';
import { PostTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';
import { CommunityPostItem } from './__generated__/CommunityPostItem';
import { DELETE_POST, REPORT_POST } from './queries';

const { fullWidth } = theme;

export interface CommunityFeedItemProps {
  post: CommunityPostItem;
  orgId: string;
  namePressable: boolean;
  onClearNotification?: (post: CommunityPostItem) => void;
  onRefresh: () => void;
}

export const CommunityFeedItem = ({
  post,
  orgId,
  namePressable,
  onClearNotification,
  onRefresh,
}: CommunityFeedItemProps) => {
  const { t } = useTranslation('communityFeedItems');
  const dispatch = useDispatch();

  const { id, postType, author, createdAt } = post;

  const isMe = useIsMe(author.id || '');

  const addToSteps = [
    PostTypeEnum.help_request,
    PostTypeEnum.prayer_request,
    PostTypeEnum.question,
  ].includes(postType);
  const isPrayer = postType === PostTypeEnum.prayer_request;

  const [deletePost] = useMutation<DeletePost, DeletePostVariables>(
    DELETE_POST,
  );
  const [reportPost] = useMutation<ReportPost, ReportPostVariables>(
    REPORT_POST,
  );

  const handlePress = () =>
    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        post,
        orgId,
        onRefresh,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(post);

  const handleEdit = () =>
    dispatch(
      navigatePush(CELEBRATE_EDIT_STORY_SCREEN, {
        post,
        orgId,
        onRefresh,
      }),
    );

  const handleDelete = () =>
    Alert.alert(t('delete.title'), t('delete.message'), [
      { text: t('cancel') },
      {
        text: t('delete.buttonText'),
        onPress: async () => {
          await deletePost({
            variables: { input: { id } },
          });
          onRefresh();
        },
      },
    ]);

  const handleReport = () =>
    Alert.alert(t('report.title'), t('report.message'), [
      { text: t('cancel') },
      {
        text: t('report.confirmButtonText'),
        onPress: () =>
          reportPost({
            variables: {
              subjectId: id,
            },
          }),
      },
    ]);

  const handleAddToMySteps = () => {
    //TODO: add to my steps
  };

  const menuActions = isMe
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
      ];

  // TODO: insert actual post type label
  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <View
          style={{
            backgroundColor: 'blue',
            height: 20,
            width: 20,
          }}
        />
      </View>
      <View style={styles.headerRow}>
        <PersonAvatar size={48} />
        <View style={styles.headerNameWrapper}>
          <CommunityFeedItemName
            name={author.fullName}
            personId={author.id}
            orgId={orgId}
            pressable={namePressable}
          />
          <CardTime date={createdAt} style={styles.headerTime} />
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={[styles.footerWrap]}>
      {addToSteps ? renderAddToStepsButton() : null}
      <View style={styles.commentLikeWrap}>
        <CommentLikeComponent
          isPrayer={isPrayer}
          post={post}
          orgId={orgId}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );

  const renderContent = () => {
    const {} = GLOBAL_COMMUNITY_IMAGE as ImageSourcePropType;

    return (
      <View style={styles.cardContent}>
        {renderHeader()}
        <CelebrateItemContent
          post={post}
          orgId={orgId}
          style={styles.postTextWrap}
        />
        <Image
          source={GLOBAL_COMMUNITY_IMAGE}
          style={{ width: '100%' }}
          resizeMode="contain"
        />
        <Separator />
        {renderFooter()}
      </View>
    );
  };

  const renderAddToStepsButton = () => (
    <Touchable style={styles.addStepWrap} onPress={handleAddToMySteps}>
      <Image source={STEP_ICON} style={styles.stepIcon} />
      <Image source={PLUS_ICON} style={styles.plusIcon} />
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

  return (
    <Card>
      <View style={{ flex: 1 }}>
        <PopupMenu
          // @ts-ignore
          testID="CelebrateItemPressable"
          actions={menuActions}
          buttonProps={{
            onPress: handlePress,
            style: { flex: 1 },
          }}
          triggerOnLongPress={true}
        >
          {renderContent()}
          {onClearNotification ? renderClearNotificationButton() : null}
        </PopupMenu>
      </View>
    </Card>
  );
};
