import React from 'react';
import { TextStyle, Text } from 'react-native';

import styles from './styles';

interface ItemHeaderTextProps {
  text: string;
  style?: TextStyle;
}

export default function ItemHeaderText({ text, style }: ItemHeaderTextProps) {
  return (
    <Text style={[styles.name, style]} numberOfLines={2}>
      {text}
    </Text>
  );
}
