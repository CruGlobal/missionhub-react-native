import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    flex: 1,
    backgroundColor: theme.white,
  },
  text: {
    fontSize: 16,
    color: theme.textColor,
    textAlign: 'left',
    paddingHorizontal: 30,
    marginTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 0,
  },
});
