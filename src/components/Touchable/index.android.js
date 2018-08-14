import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import theme from '../../theme';

class TouchableAndroid extends Component {
  handlePress = () => {
    const { pressProps, onPress } = this.props;
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress.apply(null, pressProps);
    }
  };
  render() {
    // Remove `pressProps` and `onPress` so that they aren't included in the `...rest` array
    const {
      borderless = false,
      isAndroidOpacity,
      children,
      style,
      pressProps, // eslint-disable-line no-unused-vars
      onPress, // eslint-disable-line no-unused-vars
      withoutFeedback,
      ...rest
    } = this.props;

    if (isAndroidOpacity) {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          activeOpacity={0.6}
          style={style}
          {...rest}
          onPress={this.handlePress}
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
          onPress={this.handlePress}
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
        onPress={this.handlePress}
      >
        {content}
      </TouchableNativeFeedback>
    );
  }
}

TouchableAndroid.propTypes = {
  borderless: PropTypes.bool,
  withoutFeedback: PropTypes.bool,
  isAndroidOpacity: PropTypes.bool,
  pressProps: PropTypes.array,
  onPress: PropTypes.func,
};

export default TouchableAndroid;
