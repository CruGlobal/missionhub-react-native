import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingViewProps,
} from 'react-native';

import { isAndroid } from '../../utils/common';

import styles from './styles';

const PlatformKeyboardAvoidingView = ({
  style,
  offset,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  offset?: KeyboardAvoidingViewProps['keyboardVerticalOffset'];
  children: ReactNode;
}) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={offset}
      style={[styles.container, style]}
      behavior={isAndroid ? undefined : 'padding'}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default PlatformKeyboardAvoidingView;
