import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

import styles from './styles';

import { Touchable, Text, Icon, Flex } from '../common';

const TYPES = ['transparent', 'header'];
function getTypeStyle(type) {
  if (type === 'transparent') {
    return styles.transparent;
  } else if (type === 'header') {
    return styles.header;
  } else if (type === 'header') {
    return styles.header;
  }
  return styles.button;
}
function getTextStyle(type) {
  return type === 'header' ? styles.textHeader : styles.buttonText;
}
function getIconStyle(type) {
  return type === 'header' ? styles.iconHeader : styles.icon;
}

export default class Button extends Component {
  render() {
    const { onPress, type, image, text, icon, iconType, children, disabled, style = {}, buttonTextStyle = {}, iconStyle = {}, ...rest } = this.props;
    let content = children;
    if (!children) {
      let textComp = null;
      let iconComp = null;
      let imageComp = null;
      if (text) {
        textComp = (
          <Text style={[getTextStyle(type), buttonTextStyle]}>
            {text}
          </Text>
        );
      }
      if (icon) {
        iconComp = (
          <Icon name={icon} type={iconType ? iconType : null} style={[getIconStyle(type), iconStyle]} />
        );
      }
      if (image) {
        imageComp = (
          <Image source={image} style={styles.imageStyle} />
        );
      }
      if (icon && text || (image && text)) {
        content = (
          <Flex direction="row" align="center" justify="start">
            {
              icon ? iconComp : null
            }
            {
              image ? imageComp : null
            }
            {textComp}
          </Flex>
        );
      } else {
        content = textComp || iconComp || imageComp;
      }
    }
    return (
      <Touchable onPress={disabled ? undefined : onPress} {...rest}>
        <View style={[getTypeStyle(type), disabled ? styles.disabled : null, style]}>
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
  icon: PropTypes.string,
  iconType: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
  iconStyle: PropTypes.oneOfType(styleTypes),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
