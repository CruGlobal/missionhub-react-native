import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { View, StyleProp, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { navigatePush } from '../../actions/navigation';
import PopupMenu from '../PopupMenu';
import { Card, Separator, Touchable, Icon } from '../common';
import CardTime from '../CardTime';
import CelebrateItemContent from '../CelebrateItemContent';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { orgIsGlobal } from '../../utils/common';
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

export interface CelebrateItemProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  event: Event;
  organization?: object;
  namePressable?: boolean;
  fixedHeight?: boolean;
  onClearNotification?: (event: Event) => void;
  cardStyle?: StyleProp<ViewStyle>;
  me: Person;
}

const CelebrateItem = ({
  dispatch,
  event,
  organization,
  namePressable,
  fixedHeight,
  onClearNotification,
  cardStyle,
  me,
}: CelebrateItemProps) => {
  const { t } = useTranslation('celebrateFeeds');

  const handlePress = () =>
    dispatch(navigatePush(CELEBRATE_DETAIL_SCREEN, { event }));

  const clearNotification = () =>
    onClearNotification && onClearNotification(event);

  const handleEdit = () => console.log('edit');

  const handleDelete = () => console.log('delete');

  const handleReport = () => console.log('report');

  const menuActions = event.subject_person
    ? me.id === event.subject_person.id
      ? [
          {
            text: t('editPost'),
            onPress: () => handleEdit(),
          },
          {
            text: t('deletePost'),
            onPress: () => handleDelete(),
            destructive: true,
          },
        ]
      : [
          {
            text: t('reportPost'),
            onPress: () => handleReport(),
          },
        ]
    : null;

  const {
    changed_attribute_value,
    subject_person,
    subject_person_name,
  } = event;
  const org = organization || event.organization;

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
        <CelebrateItemContent
          event={event}
          organization={org}
          fixedHeight={fixedHeight}
        />
      </View>
      <Separator />
      <View style={[styles.content, styles.commentLikeWrap]}>
        <CommentLikeComponent event={event} />
      </View>
    </View>
  );

  const renderClearNotificationButton = () =>
    onClearNotification ? (
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
    ) : null;

  return (
    <Card testID="CelebrateItemCard" style={cardStyle}>
      {!orgIsGlobal(organization) && menuActions ? (
        <PopupMenu
          actions={menuActions}
          buttonProps={{
            onPress: handlePress,
          }}
          triggerOnLongPress={true}
        >
          {renderContent()}
          {renderClearNotificationButton()}
        </PopupMenu>
      ) : (
        <View>
          {renderContent()}
          {renderClearNotificationButton()}
        </View>
      )}
    </Card>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  me: auth.person,
});

export default connect(mapStateToProps)(CelebrateItem);
