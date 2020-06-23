import React, { useMemo } from 'react';
import { View, StyleProp, Image, ImageStyle, TextStyle } from 'react-native';
import colorThis from '@eknowles/color-this';

import { Text } from '../common';
import theme from '../../theme';

import styles from './styles';

export type AvatarPerson = {
  id: string | number;
  fullName: string; // Requiring fullName because switching between fullName and firstName results in different random colors for the same person
  picture: string | null;
};

type AvatarSize = 'extrasmall' | 'small' | 'medium' | 'large';

const wrapStyles: { [key in AvatarSize]: StyleProp<ImageStyle> } = {
  extrasmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.white,
  },
  small: { width: 36, height: 36, borderRadius: 18 },
  medium: { width: 48, height: 48, borderRadius: 24 },
  large: { width: 96, height: 96, borderRadius: 48 },
};
const textStyles: { [key in AvatarSize]: StyleProp<TextStyle> } = {
  extrasmall: { fontSize: 12 },
  small: { fontSize: 20, fontWeight: '300' },
  medium: { fontSize: 26, fontWeight: '300' },
  large: { fontSize: 64, fontWeight: '300' },
};

export interface AvatarProps {
  person?: AvatarPerson;
  size: AvatarSize;
  style?: StyleProp<ImageStyle>;
  customText?: string;
}

const EMPTY_PERSON = { id: '-', fullName: '-', picture: null };

const Avatar = ({
  person = EMPTY_PERSON,
  size,
  style,
  customText,
}: AvatarProps) => {
  const initial = customText || person.fullName[0] || '-';
  const color = useMemo(() => colorThis(`${person.fullName}${person.id}`, 1), [
    person,
  ]);

  const wrapStyle = [wrapStyles[size], { backgroundColor: color }, style];

  if (person?.picture) {
    return (
      <Image
        source={{ uri: person?.picture }}
        style={wrapStyle}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.avatar, wrapStyle]}>
      <Text style={[styles.text, textStyles[size]]}>{initial}</Text>
    </View>
  );
};

export default Avatar;
