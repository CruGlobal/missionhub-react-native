import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import theme from '../../theme';

export default class Separator extends Component {
  render() {
    const { style, ...rest } = this.props;
    return <View {...rest} style={[ styles.separator, style ]} />;
  }
}

Separator.propTypes = {
  style: PropTypes.oneOfType([ PropTypes.array, PropTypes.object, PropTypes.number ]),
};

const styles = StyleSheet.create({
  separator: {
    height: theme.separatorHeight,
    backgroundColor: theme.separatorColor,
  },
});
