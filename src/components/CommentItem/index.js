import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Text } from '../common';
import CardTime from '../CardTime';
import CelebrateItemName from '../CelebrateItemName';

import styles from './styles';

export default function CommentItem({
  item: { content, created_at, person },
  organization,
}) {
  const { first_name, last_name } = person;
  const { itemStyle, text } = styles;

  return (
    <View style={itemStyle}>
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
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};
