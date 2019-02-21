import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import theme from '../../theme';

export default class SafeView extends Component {
  setNativeProps(nativeProps) {
    this.view.setNativeProps(nativeProps);
  }

  ref = c => (this.view = c);

  render() {
    const { style, bg, ...rest } = this.props;
    return (
      <SafeAreaView
        ref={this.ref}
        {...rest}
        style={[styles.view, styles[bg], style]}
      />
    );
  }
}

SafeView.propTypes = {
  ...SafeAreaView.propTypes,
  bg: PropTypes.oneOf(['primary', 'white']),
};
SafeView.defaultProps = SafeAreaView.defaultProps;

const styles = StyleSheet.create({
  view: {
    position: 'relative',
    flex: 1,
  },
  primary: { backgroundColor: theme.primaryColor },
  white: { backgroundColor: theme.white },
});
