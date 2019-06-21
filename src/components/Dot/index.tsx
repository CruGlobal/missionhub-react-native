import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import Text from '../Text';

interface DotProps {
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const Dot = ({ style }: DotProps) => <Text style={style}>{'  ·  '}</Text>;

export default Dot;
