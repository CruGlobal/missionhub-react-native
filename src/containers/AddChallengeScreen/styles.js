import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  backButton: {
    fontSize: 16,
    color: theme.lightGrey,
  },
  textInput: {
    fontSize: 32,
    lineHeight: 38,
    color: theme.lightGrey,
    marginTop: 80,
    marginBottom: 26,
  },

  imageWrap: {
    marginTop: 30,
  },
  header: {
    fontSize: 36,
    color: theme.secondaryColor,
  },
  fieldWrap: {
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 14,
    color: theme.secondaryColor,
    marginTop: 15,
    marginBottom: 5,
  },
  dateInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  disabledInput: {
    backgroundColor: '#eee',
  },
  dateText: {
    backgroundColor: theme.transparent,
    paddingVertical: 5,
    color: theme.white,
    fontSize: 16,
    letterSpacing: 0.25,
  },
});
