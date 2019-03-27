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
  header: {
    backgroundColor: theme.white,
  },
  backButton: {
    color: theme.lightGrey,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputHeaderText: {
    fontSize: 12,
    lineHeight: 16,
    textAlignVertical: 'center',
  },
  inputContentText: {
    fontSize: 16,
    lineHeight: 24,
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
