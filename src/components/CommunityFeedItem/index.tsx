import React from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Separator, Touchable, Icon } from '../common';
import CardTime from '../CardTime';
import CelebrateItemContent from '../CelebrateItemContent';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { CELEBRATE_EDIT_STORY_SCREEN } from '../../containers/Groups/EditStoryScreen';
import { orgIsGlobal } from '../../utils/common';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { Organization } from '../../reducers/organizations';
import { CommunityCelebrationCelebrateableEnum } from '../../../__generated__/globalTypes';

import styles from './styles';
import { CelebrateItem } from './__generated__/CelebrateItem';
import { DeletePost, DeletePostVariables } from './__generated__/DeletePost';
import { DELETE_POST, REPORT_POST } from './queries';
import { ReportPost, ReportPostVariables } from './__generated__/ReportPost';

export interface CommunityFeedItemProps {
  item: CelebrateItem;
  organization: Organization;
  namePressable: boolean;
  onClearNotification?: (item: CelebrateItem) => void;
  onRefresh: () => void;
}

export const CommunityFeedItem = ({
  item,
  organization,
  namePressable,
  onClearNotification,
  onRefresh,
}: CommunityFeedItemProps) => {
  const {
    celebrateableId,
    changedAttributeValue,
    subjectPerson,
    subjectPersonName,
    celebrateableType,
  } = item;

  const { t } = useTranslation('celebrateItems');
  const dispatch = useDispatch();
  const isMe = useIsMe(subjectPerson?.id || '');
  const [deletePost] = useMutation<DeletePost, DeletePostVariables>(
    DELETE_POST,
  );
  const [reportPost] = useMutation<ReportPost, ReportPostVariables>(
    REPORT_POST,
  );

  const handlePress = () =>
    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        event: item,
        orgId: organization.id,
        onRefreshCelebrateItem: onRefresh,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(item);

  const handleEdit = () =>
    dispatch(
      navigatePush(CELEBRATE_EDIT_STORY_SCREEN, {
        celebrationItem: item,
        onRefresh,
        organization,
      }),
    );

  const handleDelete = () =>
    Alert.alert(t('delete.title'), t('delete.message'), [
      { text: t('cancel') },
      {
        text: t('delete.buttonText'),
        onPress: async () => {
          await deletePost({
            variables: { input: { id: celebrateableId } },
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
              subjectId: celebrateableId,
            },
          }),
      },
    ]);

  const menuActions =
    !orgIsGlobal(organization) &&
    celebrateableType === CommunityCelebrationCelebrateableEnum.STORY
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

  const renderContent = () => (
    <View style={styles.cardContent}>
      <View style={styles.content}>
        <View style={styles.top}>
          <View style={styles.topLeft}>
            <CelebrateItemName
              name={subjectPersonName}
              person={subjectPerson}
              organization={organization}
              pressable={namePressable}
            />
            <CardTime date={changedAttributeValue} />
          </View>
        </View>
        <CelebrateItemContent event={item} organization={organization} />
      </View>
      <Separator />
      <View style={[styles.content, styles.commentLikeWrap]}>
        <CommentLikeComponent
          event={item}
          organization={organization}
          onRefresh={onRefresh}
        />
      </View>
    </View>
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

  const renderGlobalOrgCard = () => (
    <Card testID="CelebrateItemPressable">
      {renderContent()}
      {onClearNotification ? renderClearNotificationButton() : null}
    </Card>
  );

  const renderStoryCard = () => (
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

  const renderCelebrateCard = () => (
    <Card testID="CelebrateItemPressable" onPress={handlePress}>
      {renderContent()}
      {onClearNotification ? renderClearNotificationButton() : null}
    </Card>
  );

  return orgIsGlobal(organization)
    ? renderGlobalOrgCard()
    : menuActions
    ? renderStoryCard()
    : renderCelebrateCard();
};
