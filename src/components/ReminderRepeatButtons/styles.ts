import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    ...theme.textRegular12,
    letterSpacing: 1,
  },
  buttonTextInactive: {
    color: theme.lightGrey,
  },
  buttonTextActive: {
    color: theme.white,
  },
});
