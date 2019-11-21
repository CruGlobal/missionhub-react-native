import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    flexDirection: 'column',
  },
  backButton: {
    fontSize: 16,
    color: theme.lightGrey,
  },
  textInput: {
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 38,
    color: theme.lightGrey,
    borderBottomWidth: 0,
    marginTop: 64,
    marginBottom: 26,
    paddingHorizontal: 32,
  },
});
