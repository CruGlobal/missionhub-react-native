import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';

import styles from './styles';
import theme from '../../theme';

// See https://facebook.github.io/react-native/docs/textinput.html for properties

export default class Input extends Component {
  focus() { this.input.focus(); }
  blur() { this.input.blur(); }
  clear() { this.input.clear(); }

  render() {
    const { style = {}, ...rest } = this.props;
    
    return (
      <TextInput
        ref={(c) => this.input = c}
        autoCorrect={false}
        autoFocus={false}
        multiline={false}
        selectionColor={theme.primaryColor}
        underlineColorAndroid={theme.accentColor}
        {...rest}
        style={[styles.input, style]}
      />
    );
  }
}

Input.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
};
