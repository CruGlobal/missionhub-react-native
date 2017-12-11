import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import theme from '../../theme';

class TouchableAndroid extends Component {
  render() {
    const { borderless = false, isAndroidOpacity, children, style, ...rest } = this.props;

    if (isAndroidOpacity) {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          activeOpacity={0.6}
          style={style}
          {...rest}
        >
          {children}
        </TouchableOpacity>
      );
    }
    let background;
    // Android > 5.0 support
    if (Platform.Version >= 21) {
      background = TouchableNativeFeedback.Ripple(theme.convert({
        color: theme.primaryColor,
        alpha: 0.5,
      }), borderless);
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
      >
        {content}
      </TouchableNativeFeedback>
    );
  }
}

TouchableAndroid.propTypes = {
  borderless: PropTypes.bool,
  isAndroidOpacity: PropTypes.bool,
};

export default TouchableAndroid;
