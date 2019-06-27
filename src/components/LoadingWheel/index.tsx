import React from 'react';
import { Image, ImageStyle, ViewStyle, StyleProp } from 'react-native';

import { Flex } from '../common';

import styles from './styles';

interface LoadingWheelProps {
  style?: StyleProp<ViewStyle>;
  gifStyle?: ImageStyle;
}

export default function LoadingWheel({ style, gifStyle }: LoadingWheelProps) {
  return (
    <Flex
      value={1}
      align="center"
      justify="center"
      style={style || styles.container}
    >
      <Image
        source={require('../../../assets/gifs/loadingSpiralBlue.gif')}
        resizeMode="contain"
        style={gifStyle || styles.gif}
      />
    </Flex>
  );
}
