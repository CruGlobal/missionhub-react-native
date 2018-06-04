import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { isAndroid } from '../../utils/common';

import styles from './styles';

export default class PlatformKeyboardAvoidingView extends Component {
  render() {
    const { style } = this.props;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={this.props.offset}
        style={[styles.container, style]}
        behavior={this.getBehavior()}
      >
        {this.props.children}
      </KeyboardAvoidingView>
    );
  }

  getBehavior() {
    return isAndroid ? undefined : 'padding';
  }
}
