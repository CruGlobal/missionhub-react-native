import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Text } from '../common';
import CardTime from '../CardTime';
import ItemHeaderText from '../ItemHeaderText';

import styles from './styles';

export default function CommentItem({
  item: {
    content,
    created_at,
    person: { first_name, last_name },
  },
}) {
  const { itemStyle, text } = styles;

  return (
    <View style={itemStyle}>
      <ItemHeaderText text={`${first_name} ${last_name}`} />
      <Text style={text}>{content}</Text>
      <CardTime date={created_at} />
    </View>
  );
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
};
