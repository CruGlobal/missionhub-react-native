import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, IconButton } from '../common';

import styles from './styles';

export default class CenteredIconButtonWithText extends Component {
  render() {
    const {
      wrapperStyle: propsWrapperStyle,
      buttonStyle: propsButtonStyle,
      icon,
      onClick,
      text,
    } = this.props;

    const newButtonStyle = [
      styles.button,
      onClick ? {} : styles.buttonDisabled,
      propsButtonStyle,
    ];

    const newWrapperStyle = [styles.iconWrap, propsWrapperStyle];

    return (
      <Flex align="center" justify="center">
        <Flex align="center" justify="center" style={newWrapperStyle}>
          <IconButton
            disabled={!onClick}
            style={newButtonStyle}
            name={icon}
            type="MissionHub"
            onPress={onClick || (() => {})}
          />
        </Flex>
        <Text style={styles.text}>{text}</Text>
      </Flex>
    );
  }
}

CenteredIconButtonWithText.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
