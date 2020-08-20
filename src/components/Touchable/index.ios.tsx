import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlightProps,
  TouchableHighlight,
  GestureResponderEvent,
} from 'react-native';

import theme from '../../theme';

export interface TouchableIOSProps extends TouchableHighlightProps {
  highlight?: boolean;
  withoutFeedback?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  isAndroidOpacity?: boolean; // Unused here but added to prevent type errors
}

const TouchableIOS = ({
  onPress,
  highlight,
  withoutFeedback,
  ...rest
}: TouchableIOSProps) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event);
    }
  };
  if (highlight) {
    return (
      <TouchableHighlight
        accessibilityTraits="button"
        underlayColor={theme.convert({
          color: theme.primaryColor,
          alpha: 0.3,
        })}
        {...rest}
        onPress={handlePress}
      />
    );
  }
  if (withoutFeedback) {
    return (
      <TouchableWithoutFeedback
        accessibilityTraits="button"
        {...rest}
        onPress={handlePress}
      />
    );
  }
  return (
    <TouchableOpacity
      accessibilityTraits="button"
      activeOpacity={0.6}
      {...rest}
      onPress={handlePress}
    />
  );
};

export default TouchableIOS;
