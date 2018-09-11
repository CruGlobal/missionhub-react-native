import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
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
  createButton: {
    width: theme.fullWidth,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  dateInput: {
    backgroundColor: theme.transparent,
    paddingVertical: 5,
    color: theme.white,
    fontSize: 16,
    letterSpacing: 0.25,
  },
});
