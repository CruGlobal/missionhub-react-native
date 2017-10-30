import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableHighlight } from 'react-native';

import { COLORS } from '../../theme';

class TouchableIOS extends Component {
  render() {
    const { highlight, ...rest } = this.props;
    if (highlight) {
      return (
        <TouchableHighlight
          accessibilityTraits="button"
          underlayColor={COLORS.convert({ color: COLORS.DARK_BLUE, alpha: 0.3 })}
          {...rest}
        />
      );
    }
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.6}
        {...rest}
      />
    );
  }
}

TouchableIOS.propTypes = {
  highlight: PropTypes.bool,
};

export default TouchableIOS;
