import React from 'react';
import { View } from 'react-native';

import { Text } from '../common';

import styles from './styles';

interface PersonAvatarProps {
  size: number;
}

export const PersonAvatar = ({ size }: PersonAvatarProps) => {
  const halfSize = Math.ceil(size / 2.0);

  return (
    <View
      style={[
        styles.container,
        { height: size, width: size, borderRadius: halfSize },
      ]}
    >
      <Text style={[styles.placeholderText, { fontSize: halfSize }]}>C</Text>
    </View>
  );
};
