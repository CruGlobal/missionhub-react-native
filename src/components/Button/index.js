import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

import styles from './styles';

import { Touchable, Text, Flex } from '../common';

const TYPES = ['transparent', 'primary', 'secondary'];
function getTypeStyle(type) {
  if (type === 'transparent') {
    return styles.transparent;
  } else if (type === 'primary') {
    return styles.primary;
  } else if (type === 'secondary') {
    return styles.secondary;
  }
  return styles.button;
}

export default class Button extends Component {
  render() {
    const { onPress, type, image, text, pill, children, disabled, style = {}, buttonTextStyle = {}, ...rest } = this.props;
    let content = children;
    if (!children) {
      let textComp = null;
      let imageComp = null;
      if (text) {
        textComp = (
          <Text style={[styles.buttonText, buttonTextStyle]}>
            {text}
          </Text>
        );
      }
      if (image) {
        imageComp = (
          <Image source={image} style={styles.imageStyle} />
        );
      }
      if (text || (image && text)) {
        content = (
          <Flex direction="row" align="center" justify="start">
            {
              image ? imageComp : null
            }
            {textComp}
          </Flex>
        );
      } else {
        content = textComp || imageComp;
      }
    }
    return (
      <Touchable onPress={disabled ? undefined : onPress} {...rest}>
        <View style={[getTypeStyle(type), disabled ? styles.disabled : null, style, pill ? styles.pill : null]}>
          {content}
        </View>
      </Touchable>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  type: PropTypes.oneOf(TYPES),
  text: PropTypes.string,
  pill: PropTypes.bool,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
