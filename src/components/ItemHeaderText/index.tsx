import React from 'react';
import { TextStyle, Text } from 'react-native';

import styles from './styles';

interface ItemHeaderText {
  text: string;
  style?: TextStyle;
}

export default function ItemHeaderText({ text, style }: ItemHeaderText) {
  return (
    <Text style={[styles.name, style]} numberOfLines={2}>
      {text}
    </Text>
  );
}
