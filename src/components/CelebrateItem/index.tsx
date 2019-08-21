import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { connect } from 'react-redux';

import { Card, Separator, Touchable, Icon } from '../../components/common';
import CardTime from '../CardTime';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';
import CelebrateItemContent from '../CelebrateItemContent';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

export interface CelebrateItemProps {
  event: Event;
  organization?: object;
  namePressable?: boolean;
  fixedHeight?: boolean;
  onClearNotification?: (event: Event) => void;
  onPressItem?: (event: Event) => void;
  cardStyle?: StyleProp<ViewStyle>;
}

const CelebrateItem = ({
  event,
  organization,
  namePressable,
  fixedHeight,
  onClearNotification,
  onPressItem,
  cardStyle,
}: CelebrateItemProps) => {
  const handlePress = () => onPressItem && onPressItem(event);
  const clearNotification = () =>
    onClearNotification && onClearNotification(event);

  const {
    changed_attribute_value,
    subject_person,
    subject_person_name,
  } = event;
  const org = organization || event.organization;

  return (
    <Card testID="CelebrateItemCard" onPress={handlePress} style={cardStyle}>
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
      {onClearNotification ? (
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
      ) : null}
    </Card>
  );
};
export default connect()(CelebrateItem);
