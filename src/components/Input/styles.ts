import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  input: {
    ...theme.textRegular16,
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
    backgroundColor: theme.transparent,
    paddingVertical: 5,
    color: theme.white,
    letterSpacing: 0.25,
  },
});
