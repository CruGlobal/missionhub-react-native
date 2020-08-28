import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

import theme from '../../theme';

const common: StyleProp<ViewStyle> = {
  height: theme.buttonHeight,
  justifyContent: 'center',
  alignItems: 'center',
};

export default StyleSheet.create({
  button: {
    backgroundColor: theme.transparent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 0,
    margin: 0,
    borderWidth: 0,
    ...common,
  },
  // Types
  transparent: {
    backgroundColor: theme.transparent,
  },
  primary: {
    backgroundColor: theme.primaryColor,
    ...common,
  },
  secondary: {
    backgroundColor: theme.secondaryColor,
    ...common,
    height: common.height,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...theme.textBold14,
    color: theme.white,
    textAlign: 'center',
  },
  pill: {
    borderRadius: 50,
  },
});
