import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Separator, Touchable, Icon } from '../../components/common';
import CardTime from '../CardTime';
import CommentLikeComponent from '../../containers/CommentLikeComponent';
import CelebrateItemName from '../../containers/CelebrateItemName';
import CelebrateItemContent from '../CelebrateItemContent';

import styles from './styles';

class CelebrateItem extends Component {
  onPressItem = () => {
    const { onPressItem, event } = this.props;
    onPressItem && onPressItem(event);
  };

  clearNotification = () => {
    const { onClearNotification, event } = this.props;
    onClearNotification(event);
  };

  renderClearNotification() {
    return (
      <View style={styles.clearNotificationWrap}>
        <Touchable
          onPress={this.clearNotification}
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
  }

  render() {
    const {
      event,
      cardStyle,
      rightCorner,
      namePressable,
      fixedHeight,
      onClearNotification,
    } = this.props;
    const {
      changed_attribute_value,
      subject_person,
      subject_person_name,
    } = event;
    const organization = this.props.organization || event.organization;
    const { content, top, topLeft } = styles;

    return (
      <Card onPress={this.onPressItem} style={cardStyle}>
        <View flex={1} flexDirection="column">
          <View style={content}>
            <View style={top}>
              <View style={topLeft}>
                <CelebrateItemName
                  name={subject_person_name}
                  person={subject_person}
                  organization={organization}
                  pressable={namePressable}
                />
                <CardTime date={changed_attribute_value} />
              </View>
              {rightCorner}
            </View>
            <CelebrateItemContent
              event={event}
              organization={organization}
              fixedHeight={fixedHeight}
            />
          </View>
          <Separator />
          <View style={content} justifyContent="flex-end">
            <CommentLikeComponent event={event} />
          </View>
        </View>
        {onClearNotification ? this.renderClearNotification() : null}
      </Card>
    );
  }
}

CelebrateItem.propTypes = {
  event: PropTypes.object.isRequired,
  organization: PropTypes.object,
  namePressable: PropTypes.bool,
  fixedHeight: PropTypes.bool,
  onClearNotification: PropTypes.func,
};

export default connect()(CelebrateItem);
