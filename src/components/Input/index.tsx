import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';

import theme from '../../theme';

import styles from './styles';

// See https://facebook.github.io/react-native/docs/textinput.html for properties

export default class Input extends Component {
  focus() {
    this.input.focus();
  }
  blur() {
    this.input.blur();
  }
  clear() {
    this.input.clear();
  }
  isFocused() {
    return this.input.isFocused();
  }

  ref = c => (this.input = c);

  render() {
    const { style = {}, ...rest } = this.props;

    return (
      <TextInput
        ref={this.ref}
        autoCorrect={false}
        autoFocus={false}
        multiline={false}
        selectionColor={theme.accentColor}
        underlineColorAndroid="rgba(0,0,0,0)"
        placeholderTextColor={theme.textColor}
        {...rest}
        style={[styles.input, style]}
      />
    );
  }
}

Input.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
};
