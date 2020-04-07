import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Separator, Touchable, Icon } from '../common';
import CardTime from '../CardTime';
import { PersonAvatar } from '../PersonAvatar';
import CelebrateItemContent from '../CelebrateItemContent';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { CELEBRATE_EDIT_STORY_SCREEN } from '../../containers/Groups/EditStoryScreen';
import { orgIsGlobal } from '../../utils/common';
import { Organization } from '../../reducers/organizations';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItemData } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { CommunityCelebrationCelebrateableEnum } from '../../../__generated__/globalTypes';

import styles from './styles';
import { DeleteStory, DeleteStoryVariables } from './__generated__/DeleteStory';
import { ReportStory, ReportStoryVariables } from './__generated__/ReportStory';

export const DELETE_STORY = gql`
  mutation DeleteStory($input: DeleteStoryInput!) {
    deleteStory(input: $input) {
      id
    }
  }
`;

export const REPORT_STORY = gql`
  mutation ReportStory($subjectId: ID!) {
    createContentComplaint(
      input: { subjectId: $subjectId, subjectType: Story }
    ) {
      contentComplaint {
        id
      }
    }
  }
`;

//TODO:Replace with actual types
enum postTypes {
  prayerRequest,
  stepOfFaith,
  spiritualQuestion,
  godStory,
  careRequest,
  announcement,
  whatsOnYourMind,
}

export interface CommunityFeedItemProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  event: CelebrateItemData;
  organization: Organization;
  namePressable: boolean;
  onClearNotification?: (event: CelebrateItemData) => void;
  onRefresh: () => void;
}

export const CommunityFeedItem = ({
  dispatch,
  event,
  organization,
  namePressable,
  onClearNotification,
  onRefresh,
}: CommunityFeedItemProps) => {
  const { t } = useTranslation('celebrateItems');

  const {
    celebrateableId,
    changedAttributeValue,
    subjectPerson,
    subjectPersonName,
    celebrateableType,
  } = event;

  const isMe = useIsMe(subjectPerson.id);
  let postType: postTypes;

  const addToSteps = postType === postTypes.careRequest;
  const usePrayerIcon = postType === postTypes.prayerRequest;

  const [deleteStory] = useMutation<DeleteStory, DeleteStoryVariables>(
    DELETE_STORY,
  );
  const [reportStory] = useMutation<ReportStory, ReportStoryVariables>(
    REPORT_STORY,
  );

  const handlePress = () =>
    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        event,
        orgId: organization.id,
        onRefreshCelebrateItem: onRefresh,
      }),
    );

  const clearNotification = () =>
    onClearNotification && onClearNotification(event);

  const handleEdit = () =>
    dispatch(
      navigatePush(CELEBRATE_EDIT_STORY_SCREEN, {
        celebrationItem: event,
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
          await deleteStory({
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
          reportStory({
            variables: {
              subjectId: celebrateableId,
            },
          }),
      },
    ]);

  const menuActions =
    !orgIsGlobal(organization) &&
    celebrateableType === CommunityCelebrationCelebrateableEnum.STORY
      ? subjectPerson && me.id === subjectPerson.id
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
          <CelebrateItemName
            name={subjectPersonName}
            person={subjectPerson}
            organization={organization}
            pressable={namePressable}
          />
          <CardTime date={changedAttributeValue} style={styles.headerTime} />
        </View>
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={styles.cardContent}>
      {renderHeader()}
      <CelebrateItemContent event={event} organization={organization} />
      <Separator />
      <View style={[styles.commentLikeWrap]}>
        <CommentLikeComponent
          event={event}
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
