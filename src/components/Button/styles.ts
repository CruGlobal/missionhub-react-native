import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

import theme from '../../theme';

const common: StyleProp<ViewStyle> = {
  height: theme.buttonHeight,
  justifyContent: 'center',
  alignItems: 'center',
};

export default StyleSheet.create({
  button: {
    backgroundColor: theme.buttonBackgroundColor,
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
    color: theme.buttonTextColor,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1.5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  pill: {
    borderRadius: 50,
  },
});
