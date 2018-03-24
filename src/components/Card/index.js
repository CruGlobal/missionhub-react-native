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
    if (onPress) {
      return (
        <Touchable
          ref={this.ref}
          {...rest}
          onPress={onPress}
          style={[styles.card, style]}
        />
      );
    }
    return <View ref={this.ref} {...rest} style={[styles.card, style]} />;
  }
}
