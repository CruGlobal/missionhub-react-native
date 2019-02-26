import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';

import theme from '../../theme';

class TouchableIOS extends Component {
  handlePress = () => {
    const { pressProps, onPress } = this.props;
    if (onPress) {
      // Call the onPress with all of the pressProps passed in or just undefined if it doesn't exist
      onPress.apply(null, pressProps);
    }
  };

  render() {
    // Remove `pressProps` so that they aren't included in the `...rest` array
    const {
      highlight,
      withoutFeedback,
      pressProps, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;

    if (highlight) {
      return (
        <TouchableHighlight
          accessibilityTraits="button"
          underlayColor={theme.convert({
            color: theme.primaryColor,
            alpha: 0.3,
          })}
          {...rest}
          onPress={this.handlePress}
        />
      );
    }
    if (withoutFeedback) {
      return (
        <TouchableWithoutFeedback
          accessibilityTraits="button"
          {...rest}
          onPress={this.handlePress}
        />
      );
    }
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.6}
        {...rest}
        onPress={this.handlePress}
      />
    );
  }
}

TouchableIOS.propTypes = {
  highlight: PropTypes.bool,
  withoutFeedback: PropTypes.bool,
  pressProps: PropTypes.array,
  onPress: PropTypes.func,
};

export default TouchableIOS;
