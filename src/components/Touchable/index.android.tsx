import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Platform,
  TouchableHighlightProps,
  GestureResponderEvent,
} from 'react-native';

import theme from '../../theme';

export interface TouchableAndroidProps extends TouchableHighlightProps {
  borderless?: boolean;
  withoutFeedback?: boolean;
  isAndroidOpacity?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
}

const TouchableAndroid = ({
  onPress,
  borderless = false,
  isAndroidOpacity,
  children,
  style,
  withoutFeedback,
  ...rest
}: TouchableAndroidProps) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event);
    }
  };
  if (isAndroidOpacity) {
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.6}
        style={style}
        {...rest}
        onPress={handlePress}
      >
        {children}
      </TouchableOpacity>
    );
  }
  if (withoutFeedback) {
    return (
      <TouchableWithoutFeedback
        accessibilityTraits="button"
        {...rest}
        onPress={handlePress}
      >
        {children}
      </TouchableWithoutFeedback>
    );
  }
  let background;
  // Android > 5.0 support
  if (Platform.Version >= 21) {
    background = TouchableNativeFeedback.Ripple(
      theme.convert({
        color: theme.primaryColor,
        alpha: 0.5,
      }),
      borderless,
    );
  } else {
    background = TouchableNativeFeedback.SelectableBackground();
  }
  // TouchableNativeFeedback doesn't have a style prop, need to pass style to a view
  let content = children;
  if (style) {
    content = <View style={style}>{children}</View>;
  }
  return (
    <TouchableNativeFeedback
      accessibilityTraits="button"
      background={background}
      {...rest}
      onPress={handlePress}
    >
      {content}
    </TouchableNativeFeedback>
  );
};

export default TouchableAndroid;
