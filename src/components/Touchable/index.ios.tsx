import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlightProps,
  TouchableHighlight,
} from 'react-native';

import theme from '../../theme';

interface TouchableIOSProps extends TouchableHighlightProps {
  highlight?: boolean;
  withoutFeedback?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pressProps?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPress?: (...args: any[]) => any;
  children?: React.ReactNode;
}

const TouchableIOS = ({
  pressProps = [],
  onPress,
  highlight,
  withoutFeedback,
  ...rest
}: TouchableIOSProps) => {
  const handlePress = () => {
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress(...pressProps);
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
