import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { hasNotch } from '../../utils/common';

const common = {
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
    height: hasNotch() ? common.height + 25 : common.height,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.buttonTextColor,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1.5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  pill: {
    borderRadius: 50,
  },
});
