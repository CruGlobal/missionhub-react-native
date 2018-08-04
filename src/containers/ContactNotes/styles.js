import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  notesText: {
    fontSize: 16,
    color: theme.textColor,
    textAlign: 'left',
    paddingHorizontal: 36,
    marginTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 0,
  },
  list: {
    backgroundColor: theme.transparent,
  },
});
