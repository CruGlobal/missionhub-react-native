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
import CelebrateItemContent from '../CelebrateItemContent';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { CELEBRATE_EDIT_STORY_SCREEN } from '../../containers/Groups/EditStoryScreen';
import { orgIsGlobal } from '../../utils/common';
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';
import { CELEBRATEABLE_TYPES } from '../../constants';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

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

export interface CelebrateItemProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  event: GetCelebrateFeed_community_celebrationItems_nodes;
  organization: object;
  namePressable: boolean;
  onClearNotification?: (
    event: GetCelebrateFeed_community_celebrationItems_nodes,
  ) => void;
  onRefresh: () => void;
  me: Person;
}

const CelebrateItem = ({
  dispatch,
  event,
  organization,
  namePressable,
  onClearNotification,
  onRefresh,
  me,
}: CelebrateItemProps) => {
  const {
    celebrateableId,
    changedAttributeValue,
    subjectPerson,
    subjectPersonName,
    celebrateableType,
  } = event;

  const { t } = useTranslation('celebrateItems');
  const [deleteStory] = useMutation<DeleteStory, DeleteStoryVariables>(
    DELETE_STORY,
  );
  const [reportStory] = useMutation<ReportStory, ReportStoryVariables>(
    REPORT_STORY,
  );

  const handlePress = () =>
    dispatch(navigatePush(CELEBRATE_DETAIL_SCREEN, { event }));

  const clearNotification = () =>
    onClearNotification && onClearNotification(event);

  const handleEdit = () =>
    dispatch(
      navigatePush(CELEBRATE_EDIT_STORY_SCREEN, {
        celebrationItem: event,
        onRefresh,
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
    celebrateableType === CELEBRATEABLE_TYPES.story
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
        <CelebrateItemContent event={event} organization={organization} />
      </View>
      <Separator />
      <View style={[styles.content, styles.commentLikeWrap]}>
        <CommentLikeComponent event={event} organization={organization} />
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

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  me: auth.person,
});

export default connect(mapStateToProps)(CelebrateItem);
