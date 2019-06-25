import React, { ReactNode } from 'react';
import {
  View,
  ViewProps,
  TouchableOpacityProps,
  TouchableHighlightProps,
} from 'react-native';

import { Touchable } from '../common';

import styles from './styles';

interface CardProps {
  onPress?: Function;
  children?: ReactNode;
}

const Card = ({
  style,
  onPress,
  ...rest
}: CardProps & ViewProps & TouchableOpacityProps & TouchableHighlightProps) => {
  return onPress ? (
    <Touchable {...rest} onPress={onPress} style={[styles.card, style]} />
  ) : (
    <View {...rest} style={[styles.card, style]} />
  );
};

export default Card;
