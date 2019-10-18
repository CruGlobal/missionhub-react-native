import React from 'react';
import { TextStyle } from 'react-native';

import { Text } from '../../components/common';

import styles from './styles';

interface ItemHeaderText {
  text: string;
  style?: TextStyle;
}

export default function ItemHeaderText({ text, style }: ItemHeaderText) {
  return <Text style={[styles.name, style]}>{text}</Text>;
}
