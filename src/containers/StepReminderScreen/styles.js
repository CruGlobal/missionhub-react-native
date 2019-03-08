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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  button: {
    height: 70,
    width: 70,
    margin: 8,
    borderRadius: 35,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonInactive: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.lightGrey,
  },
  buttonActive: {
    backgroundColor: theme.secondaryColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    fontWeight: 'normal',
  },
  buttonTextInactive: {
    color: theme.lightGrey,
  },
  buttonTextActive: {
    color: theme.white,
  },
});
