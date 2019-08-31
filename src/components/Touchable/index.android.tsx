import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Platform,
  TouchableHighlightProps,
} from 'react-native';

import theme from '../../theme';

interface TouchableAndroidProps extends TouchableHighlightProps {
  borderless?: boolean;
  withoutFeedback?: boolean;
  isAndroidOpacity?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pressProps?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPress?: (...args: any[]) => any;
  children?: React.ReactNode;
}

const TouchableAndroid = ({
  pressProps = [],
  onPress,
  borderless = true,
  isAndroidOpacity,
  children,
  style,
  withoutFeedback,
  ...rest
}: TouchableAndroidProps) => {
  const handlePress = () => {
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress(...pressProps);
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
