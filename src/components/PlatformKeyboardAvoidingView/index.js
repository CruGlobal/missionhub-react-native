import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import styles from './styles';
import { isAndroid } from '../../utils/common';

export default class PlatformKeyboardAvoidingView extends Component {
  render() {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={this.props.offset} style={styles.container} behavior={this.getBehavior()}>
        {this.props.children}
      </KeyboardAvoidingView>
    );
  }

  getBehavior() {
    return isAndroid ? undefined : 'padding';
  }
}