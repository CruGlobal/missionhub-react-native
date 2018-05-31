import React, { Component } from 'react';

import Touchable from '../Touchable';
import { Text } from '../common';

import styles from './styles';

export default class Card extends Component {
  render() {
    return (
      <Touchable style={styles.container}>
        <Text style={{ fontSize: 20 }}>TEXTTEXTTEXTTEXTTEXTTEXTTEXT</Text>
      </Touchable>
    );
  }
}
