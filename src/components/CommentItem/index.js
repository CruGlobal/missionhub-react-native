import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Text, Touchable } from '../common';
import CardTime from '../CardTime';
import CelebrateItemName from '../../containers/CelebrateItemName';

import styles from './styles';

export default class CommentItem extends Component {
  ref = c => (this.view = c);

  handleLongPress = () => {
    const { item, onLongPress } = this.props;
    onLongPress(item, this.view);
  };

  render() {
    const {
      item: { content, created_at, person, organization },
      onLongPress,
    } = this.props;
    const { itemStyle, text } = styles;
    const { first_name, last_name } = person;

    const component = (
      <View ref={this.ref} style={itemStyle}>
        <CelebrateItemName
          name={`${first_name} ${last_name}`}
          person={person}
          organization={organization}
          pressable={true}
        />
        <Text style={text}>{content}</Text>
        <CardTime date={created_at} />
      </View>
    );
    if (onLongPress) {
      return (
        <Touchable onLongPress={this.handleLongPress}>{component}</Touchable>
      );
    }
    return component;
  }
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  onLongPress: PropTypes.func,
};
