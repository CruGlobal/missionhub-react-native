import { StyleSheet } from 'react-native';

import theme from '../../theme';

export const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: theme.darkGrey,
    alignItems: 'center',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: { ...theme.textRegular16, color: theme.white },
});
