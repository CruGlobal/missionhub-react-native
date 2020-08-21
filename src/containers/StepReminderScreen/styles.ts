import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    flexDirection: 'column',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateInputContainer: {
    paddingHorizontal: 48,
    paddingBottom: 36,
  },
  headerText: theme.textRegular16,
  inputHeaderText: {
    ...theme.textRegular12,
    textAlignVertical: 'center',
  },
  inputContentText: {
    ...theme.textRegular16,
    textAlignVertical: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.lightGrey,
    paddingBottom: 6,
  },
  inputTextInactive: {
    color: theme.lightGrey,
  },
  inputTextFull: {
    color: theme.primaryColor,
  },
});
