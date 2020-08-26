import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export const styles = StyleSheet.create({
  socialButton: {
    width: '100%',
    height: 50,
    margin: 4,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
  },
  socialButtonText: {
    color: theme.white,
    fontSize: 18,
  },
});
