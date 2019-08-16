import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';

import styles from './styles';

const NullStateComponent = ({
  imageSource,
  headerText,
  descriptionText,
  content,
}) => (
  <Flex align="center" justify="center" value={1} style={styles.container}>
    <Image
      source={imageSource}
      style={{ flexShrink: 1 }}
      resizeMode="contain"
    />
    <Text header={true} style={styles.header}>
      {headerText}
    </Text>
    <Text style={styles.description}>{descriptionText}</Text>
    {content}
  </Flex>
);
NullStateComponent.propTypes = {
  imageSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
    .isRequired,
  headerText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
};

export default NullStateComponent;
