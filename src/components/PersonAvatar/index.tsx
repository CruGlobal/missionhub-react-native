import React from 'react';
import { View } from 'react-native';

import { Text } from '../common';

import styles from './styles';

interface PersonAvatarProps {
  size: number;
}

export const PersonAvatar = ({ size }: PersonAvatarProps) => {
  return (
    <View
      style={[
        styles.container,
        { height: size, width: size, borderRadius: Math.ceil(size / 2.0) },
      ]}
    >
      <Text style={styles.placeholderText}>C</Text>
    </View>
  );
};
