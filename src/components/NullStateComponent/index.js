import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';

import styles from './styles';

export default class NullStateComponent extends Component {
  render() {
    const { imageSource, headerText, descriptionText } = this.props;
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Image
          source={imageSource}
          style={{ flexShrink: 1 }}
          resizeMode="contain"
        />
        <Text type="header" style={styles.header}>
          {headerText}
        </Text>
        <Text style={styles.description}>{descriptionText}</Text>
      </Flex>
    );
  }
}

NullStateComponent.propTypes = {
  imageSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
    .isRequired,
  headerText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
};
