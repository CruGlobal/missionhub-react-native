import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import Text from '../Text';
import styles from './styles';

interface DotProps {
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const Dot = ({ style }: DotProps) => (
  <Text style={[styles.dot, style]}>{' · '}</Text>
);

export default Dot;
