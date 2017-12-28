import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import styles from './styles';

export default class PlatformKeyboardAvoidingView extends Component {
  render() {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={this.props.offset} style={styles.container} behavior={this.getBehavior()}>
        {this.props.children}
      </KeyboardAvoidingView>
    );
  }

  getBehavior() {
    return Platform.OS === 'android' ? undefined : 'padding';
  }
}