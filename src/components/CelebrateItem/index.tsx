import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
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
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';
import { CELEBRATEABLE_TYPES } from '../../constants';

import styles from './styles';

export const DELETE_STORY = gql`
  mutation DeleteStory($input: StoryDeleteInput!) {
    deleteStory(input: $input) {
      id
    }
  }
`;

export interface Event {
  id: string;
  changed_attribute_value: string;
  subject_person?: Person;
  subject_person_name: string;
  celebrateable_type: string;
  organization?: Organization;
  object_description: string;
}

export interface CelebrateItemProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  event: Event;
  organization?: object;
  namePressable?: boolean;
  onClearNotification?: (event: Event) => void;
  onRefresh?: () => void;
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
    id,
    changed_attribute_value,
    subject_person,
    subject_person_name,
    celebrateable_type,
  } = event;
  const org = organization || event.organization;

  const { t } = useTranslation('celebrateItems');
  const [deleteStory] = useMutation(DELETE_STORY);

  const handlePress = () =>
    dispatch(navigatePush(CELEBRATE_DETAIL_SCREEN, { event }));

  const clearNotification = () =>
    onClearNotification && onClearNotification(event);

  const handleEdit = () =>
    dispatch(
      navigatePush(CELEBRATE_EDIT_STORY_SCREEN, {
        celebrationIten: event,
        onRefresh,
      }),
    );

  const handleDelete = () => {
    Alert.alert(t('delete.title'), t('delete.message'), [
      { text: t('cancel') },
      {
        text: t('delete.buttonText'),
        onPress: () =>
          deleteStory({
            variables: { input: { id } },
          }),
      },
    ]);
  };

  const handleReport = () => {
    Alert.alert(t('report.title'), t('report.message'), [
      { text: t('cancel') },
      {
        text: t('report.confirmButtonText'),
        onPress: () => {},
      },
    ]);
  };

  const menuActions =
    !orgIsGlobal(org) &&
    celebrateable_type === CELEBRATEABLE_TYPES.story &&
    subject_person
      ? me.id === subject_person.id
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
              name={subject_person_name}
              person={subject_person}
              organization={org}
              pressable={namePressable}
            />
            <CardTime date={changed_attribute_value} />
          </View>
        </View>
        <CelebrateItemContent event={event} organization={org} />
      </View>
      <Separator />
      <View style={[styles.content, styles.commentLikeWrap]}>
        <CommentLikeComponent event={event} />
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
    <Card testID="CelebrateItemCard">
      {renderContent()}
      {onClearNotification ? renderClearNotificationButton() : null}
    </Card>
  );

  const renderStoryCard = () => (
    <Card testID="CelebrateItemCard">
      <PopupMenu
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
    </Card>
  );

  const renderCelebrateCard = () => (
    <Card testID="CelebrateItemCard" onPress={handlePress}>
      {renderContent()}
      {onClearNotification ? renderClearNotificationButton() : null}
    </Card>
  );

  return orgIsGlobal(org)
    ? renderGlobalOrgCard()
    : menuActions
    ? renderStoryCard()
    : renderCelebrateCard();
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  me: auth.person,
});

export default connect(mapStateToProps)(CelebrateItem);
