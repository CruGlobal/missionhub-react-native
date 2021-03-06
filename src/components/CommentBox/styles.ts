import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  inputBox: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  input: {
    ...theme.textRegular14,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 0,
  },
  submitIcon: {
    color: theme.primaryColor,
  },
  cancelWrap: {
    backgroundColor: theme.lightGrey,
    borderRadius: 25,
  },
  cancelIcon: {
    color: theme.white,
  },
});
