import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  categoryButton: {
    width: theme.fullWidth - 100,
    marginVertical: 4,
    height: 72,
    backgroundColor: theme.accentColor,
  },
  categoryActive: {
    backgroundColor: theme.secondaryColor,
  },
  categoryButtonText: {
    ...theme.textLight24,
    color: theme.white,
  },
});
