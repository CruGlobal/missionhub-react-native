import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles';

class Card extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }
  render() {
    const { style, ...rest } = this.props;
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
