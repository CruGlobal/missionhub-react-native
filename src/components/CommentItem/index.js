import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Text, Touchable } from '../common';
import CardTime from '../CardTime';
import ItemHeaderText from '../ItemHeaderText';

import styles from './styles';

export default class CommentItem extends Component {
  ref = c => (this.view = c);

  handleLongPress = () => {
    const { item, onLongPress } = this.props;
    onLongPress(item, this.view);
  };

  render() {
    const {
      item: {
        content,
        created_at,
        person: { first_name, last_name },
      },
      onLongPress,
    } = this.props;
    const { itemStyle, text } = styles;

    const component = (
      <View ref={this.ref} style={itemStyle}>
        <ItemHeaderText text={`${first_name} ${last_name}`} />
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
  onLongPress: PropTypes.func,
};
