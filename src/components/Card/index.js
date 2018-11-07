import React, { Component } from 'react';
import { View } from 'react-native';

import { Touchable } from '../common';

import styles from './styles';

export default class Card extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }

  ref = c => (this._view = c);

  render() {
    const { style, onPress, ...rest } = this.props;
    return onPress ? (
      <Touchable
        ref={this.ref}
        {...rest}
        onPress={onPress}
        style={[styles.card, style]}
      />
    ) : (
      <View ref={this.ref} {...rest} style={[styles.card, style]} />
    );
  }
}
