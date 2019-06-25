import React, { forwardRef, Ref } from 'react';
import { TextInput, TextInputProps } from 'react-native';

import theme from '../../theme';

import styles from './styles';

// See https://facebook.github.io/react-native/docs/textinput.html for properties

const Input = forwardRef(
  ({ style = {}, ...rest }: TextInputProps, ref: Ref<TextInput>) => (
    <TextInput
      ref={ref}
      autoCorrect={false}
      autoFocus={false}
      multiline={false}
      selectionColor={theme.accentColor}
      underlineColorAndroid="rgba(0,0,0,0)"
      placeholderTextColor={theme.textColor}
      {...rest}
      style={[styles.input, style]}
    />
  ),
);
Input.displayName = 'Input';

export default Input;
