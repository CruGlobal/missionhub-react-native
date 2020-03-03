import React from 'react';
import { Image } from 'react-native';

import { Flex, Text } from '../../components/common';

import styles from './styles';

interface NullStateComponentProps {
  imageSource: object | number;
  headerText: string;
  descriptionText: string;
  content?: React.ReactNode;
}

const NullStateComponent = ({
  imageSource,
  headerText,
  descriptionText,
  content,
}: NullStateComponentProps) => {
  return (
    <Flex align="center" justify="center" value={1} style={styles.container}>
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
