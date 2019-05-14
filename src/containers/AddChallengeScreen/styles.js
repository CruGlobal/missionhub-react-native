import { StyleSheet } from 'react-native';

import theme from '../../theme';

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
    marginTop: 80,
    marginBottom: 26,
    paddingHorizontal: 32,
  },
  dateWrap: {
    borderColor: theme.extraLightGrey,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  dateLabel: {
    fontSize: 10,
    color: theme.lightGrey,
  },
  dateInput: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.lightGrey,
  },
});
