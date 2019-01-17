import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import debounce from 'lodash/debounce';

import { Touchable, Text } from '../common';
import { exists } from '../../utils/common';

import styles from './styles';

const TYPES = ['transparent', 'primary', 'secondary'];
// Return the styles.TYPE if it exists or just the default button style
const getTypeStyle = type =>
  exists(styles[type]) ? styles[type] : styles.button;

export default class Button extends Component {
  state = {
    clickedDisabled: false,
  };

  componentWillUnmount() {
    // Make sure to clear the timeout when the Button unmounts
    this.setClickDisableTimeout = () => {};
  }

  setClickDisableTimeout = () => {
    setTimeout(() => {
      this.setState({ clickedDisabled: false });
    }, 400);
  };

  handlePress = async (...args) => {
    const { pressProps, onPress } = this.props;
    // Prevent the user from being able to click twice
    this.setState({ clickedDisabled: true });

    try {
      // If pressProps are passed in, use those when calling the `onPress` method
      if (pressProps) {
        await onPress.apply(null, pressProps);
      } else {
        // Call the users click function with all the normal click parameters
        await onPress(...args);
      }
    } finally {
      // Re-enable the button after the timeout after any promises in the handler complete
      this.setClickDisableTimeout();
    }
  };

  // Debounce this function so it doesn't get called too quickly in succession
  handlePressDb = debounce(this.handlePress, 25);

  render() {
    const {
      type,
      text,
      pill,
      children,
      disabled,
      style = {},
      buttonTextStyle = {},
      pressProps, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;
    let content = children;
    if (!children) {
      // If there are no children passed in, assume text is used for the button
      const textStyle = [styles.buttonText, buttonTextStyle];
      if (text) {
        content = <Text style={textStyle}>{text}</Text>;
      }
    }
    const isDisabled = disabled || this.state.clickedDisabled;
    return (
      <Touchable {...rest} disabled={isDisabled} onPress={this.handlePressDb}>
        <View
          style={[
            getTypeStyle(type),
            disabled ? styles.disabled : null,
            style,
            pill ? styles.pill : null,
          ]}
        >
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
  pressProps: PropTypes.array,
};
