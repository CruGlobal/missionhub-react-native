import React, { Component } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import debounce from 'lodash.debounce';

import { Touchable, Text } from '../common';
import { exists } from '../../utils/common';
import { PressPropsType, TouchablePress } from '../Touchable/index.ios';

import styles from './styles';
import Flex from '../Flex';

// Return the styles.TYPE if it exists or just the default button style
const getTypeStyle = (type: ButtonProps['type']) =>
  type && exists(styles[type]) ? styles[type] : styles.button;

export interface ButtonProps {
  onPress: TouchablePress;
  type?: 'transparent' | 'primary' | 'secondary';
  text?: string;
  image?: ImageSourcePropType;
  pill?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  pressProps?: PressPropsType;
  testID?: string;
}
interface ButtonState {
  clickedDisabled: boolean;
}
export default class Button extends Component<ButtonProps, ButtonState> {
  state = {
    clickedDisabled: false,
  };
  clickDisableTimeout: ReturnType<typeof setTimeout> | null = null;

  componentWillUnmount() {
    // Make sure to clear the timeout when the Button unmounts
    if (this.clickDisableTimeout) {
      clearTimeout(this.clickDisableTimeout);
    }
    this.setClickDisableTimeout = () => {};
  }

  setClickDisableTimeout = () => {
    this.clickDisableTimeout = setTimeout(
      () => this.setState({ clickedDisabled: false }),
      400,
    );
  };

  handlePress = async (...args: PressPropsType) => {
    const { pressProps, onPress } = this.props;
    // Prevent the user from being able to click twice
    this.setState({ clickedDisabled: true });
    try {
      // If pressProps are passed in, use those when calling the `onPress` method
      if (pressProps) {
        await onPress(...pressProps);
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
      image,
      children,
      disabled,
      style = {},
      buttonTextStyle = {},
      pressProps, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    } = this.props;
    let content = children;
    if (!children) {
      // If there are no children passed in, assume text is used for the button
      const textStyle = [styles.buttonText, buttonTextStyle];
      if (text) {
        content = image ? (
          <Flex direction={'row'} justify={'around'} align={'center'}>
            <Image source={image} style={{ marginHorizontal: 5 }} />
            <Text style={textStyle}>{text}</Text>
          </Flex>
        ) : (
          <Text style={textStyle}>{text}</Text>
        );
      }
    }
    const isDisabled = disabled || this.state.clickedDisabled;
    return (
      <Touchable
        testID="Button"
        {...rest}
        disabled={isDisabled}
        onPress={this.handlePressDb}
      >
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
