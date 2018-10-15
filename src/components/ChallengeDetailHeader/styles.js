import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.white,
    paddingVertical: 10,
  },
  editButtonText: {
    color: theme.secondaryColor,
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 1,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 14,
    marginBottom: 3,
  },
});
