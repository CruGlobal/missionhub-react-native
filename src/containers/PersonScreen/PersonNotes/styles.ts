import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  notesText: {
    ...theme.textRegular16,
    textAlign: 'left',
    paddingHorizontal: 36,
    marginTop: 30,
    borderBottomWidth: 0,
  },
  nullState: {
    marginTop: 20,
  },
});
