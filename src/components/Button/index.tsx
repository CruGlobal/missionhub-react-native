import React, { Component } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
  ViewProps,
  GestureResponderEvent,
  Text,
} from 'react-native';
import debounce from 'lodash.debounce';

import { Touchable, Flex } from '../common';
import { exists } from '../../utils/common';

import styles from './styles';

// Return the styles.TYPE if it exists or just the default button style
const getTypeStyle = (type: ButtonProps['type']) =>
  type && exists(styles[type]) ? styles[type] : styles.button;

export interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  type?: 'transparent' | 'primary' | 'secondary';
  text?: string;
  image?: ImageSourcePropType;
  pill?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  isAndroidOpacity?: boolean;
  activeOpacity?: number;
  testID?: string;
  viewProps?: ViewProps;
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

  handlePress = async (event: GestureResponderEvent) => {
    const { onPress } = this.props;
    // Prevent the user from being able to click twice
    this.setState({ clickedDisabled: true });
    try {
      // Call the users click function with all the normal click parameters
      await onPress(event);
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
      viewProps = {},
      style = {},
      buttonTextStyle = {},
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
          {...viewProps}
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
