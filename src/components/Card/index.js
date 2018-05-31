import React, { Component } from 'react';

import Touchable from '../Touchable';

import styles from './styles';

export default class Card extends Component {
  handlePress = () => {
    this.props.onPress();
  };

  render() {
    return (
      <Touchable style={styles.container} onPress={this.handlePress}>
        {this.props.children}
      </Touchable>
    );
  }
}
