import { StyleSheet } from 'react-native';

import theme from '../../theme';

export const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: theme.grey,
    alignItems: 'center',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  white: { color: theme.white },
});
