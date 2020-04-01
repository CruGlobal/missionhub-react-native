import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import styles from './styles';

interface TriangleIndicatorProps {
  color: string;
  rotation?: number;
  style?: StyleProp<ViewStyle>;
}

export const TriangleIndicator = ({
  color,
  rotation = 0,
  style,
}: TriangleIndicatorProps) => (
  <View
    style={[
      styles.triangle,
      { borderBottomColor: color, transform: [{ rotate: `${rotation}deg` }] },
      style,
    ]}
  />
);
