import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import { COLORS } from '../../theme';

class TouchableAndroid extends Component {
  render() {
    const { borderless = false, isAndroidOpacity, ...rest } = this.props;

    if (isAndroidOpacity) {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          activeOpacity={0.6}
          {...rest}
        />
      );
    }
    let background;
    // Android > 5.0 support
    if (Platform.Version >= 21) {
      background = TouchableNativeFeedback.Ripple(COLORS.convert({
        color: COLORS.GREY,
        alpha: 0.5,
      }), borderless);
    } else {
      background = TouchableNativeFeedback.SelectableBackground();
    }
    return (
      <TouchableNativeFeedback
        accessibilityTraits="button"
        background={background}
        {...rest}
      />
    );
  }
}

TouchableAndroid.propTypes = {
  borderless: PropTypes.bool,
  isAndroidOpacity: PropTypes.bool,
};

export default TouchableAndroid;
