import React from 'react';
import { Image, StyleProp, ViewStyle, Text } from 'react-native';

import { Flex } from '../../components/common';

import styles from './styles';

interface NullStateComponentProps {
  imageSource: Record<string, unknown> | number;
  headerText: string;
  descriptionText: string;
  content?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const NullStateComponent = ({
  imageSource,
  headerText,
  descriptionText,
  content,
  style,
}: NullStateComponentProps) => {
  return (
    <Flex
      align="center"
      justify="center"
      value={1}
      style={[styles.container, style]}
    >
      <Image
        source={imageSource}
        style={{ flexShrink: 1 }}
        resizeMode="contain"
      />
      <Text style={styles.header}>{headerText}</Text>
      <Text style={styles.description}>{descriptionText}</Text>
      {content}
    </Flex>
  );
};

export default NullStateComponent;
