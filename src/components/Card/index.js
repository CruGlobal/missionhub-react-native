import React, { Component } from 'react';
import { View } from 'react-native';

import { Touchable } from '../common';

import styles from './styles';

class Card extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }
  render() {
    const { style, onPress, ...rest } = this.props;
    if (onPress) {
      return (
        <Touchable
          ref={c => (this._view = c)}
          {...rest}
          onPress={onPress}
          style={[styles.card, style]}
        />
      );
    }
    return (
      <View
        ref={c => (this._view = c)}
        {...rest}
        style={[styles.card, style]}
      />
    );
  }
}

export default Card;
