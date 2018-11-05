import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { Flex, Text } from '../common';

import styles from './styles';

export class DigitInput extends Component {
  state = {
    fullCode: [],
    focusedRef: null,
  };

  setFocusedDigit = () => {
    let index = this.state.fullCode.length;
    if (index >= 6) {
      index = 5;
    }

    const focusedRef = `digit${index}`;

    this.refs[focusedRef].focus();
    this.setState({ focusedRef });
  };

  handleKeyPress = event => {
    const {
      nativeEvent: { key: keyValue },
    } = event;
    const { fullCode } = this.state;
    console.log(keyValue);
    if (keyValue === 'Enter') {
      return;
    }
    if (keyValue === 'Backspace') {
      // user pressed backspace
      fullCode.pop();
    } else if (fullCode.length === 6) {
      return;
    } else {
      fullCode.push(keyValue);
    }
    this.setState({ fullCode });
    this.setFocusedDigit();
  };

  handleDigitFocus = () => {
    this.setFocusedDigit();
  };

  handleDigitBlur = () => {
    this.setState({ focusedRef: null });
  };

  renderDigit = index => {
    const { fullCode } = this.state;

    const ref = `digit${index}`;
    return (
      <TextInput
        ref={ref}
        style={styles.digit}
        value={fullCode[index] || ''}
        onKeyPress={this.handleKeyPress}
        onBlur={this.handleDigitBlur}
        onFocus={this.handleDigitFocus}
        maxLength={1}
      />
    );
  };

  render() {
    const { fullCode } = this.state;
    return (
      <Flex align="center" justify="center" direction="row">
        {this.renderDigit(0)}
        {this.renderDigit(1)}
        {this.renderDigit(2)}
        <Text style={styles.digit}>-</Text>
        {this.renderDigit(3)}
        {this.renderDigit(4)}
        {this.renderDigit(5)}
      </Flex>
    );
  }
}
