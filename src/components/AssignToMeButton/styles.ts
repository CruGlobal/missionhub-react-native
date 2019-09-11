import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  assignButton: {
    paddingVertical: 8,
    backgroundColor: theme.red,
    borderRadius: 25,
    minWidth: 200,
    alignSelf: 'center',
    marginVertical: 8,
  },
  assignButtonText: {
    fontSize: 14,
  },
});
