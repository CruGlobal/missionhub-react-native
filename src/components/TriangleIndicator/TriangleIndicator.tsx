import React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface TriangleIndicatorProps {
  color: string;
  rotation?: number;
}

export const TriangleIndicator = ({
  color,
  rotation = 0,
}: TriangleIndicatorProps) => (
  <View
    style={[
      styles.triangle,
      { borderBottomColor: color, transform: [{ rotate: `${rotation}deg` }] },
    ]}
  />
);
