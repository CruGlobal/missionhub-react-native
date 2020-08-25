import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  subHeader: {
    ...theme.textRegular12,
    color: theme.lightGrey,
  },
  number: {
    ...theme.textLight32,
    color: theme.secondaryColor,
    fontFamily: 'SourceSansPro-ExtraLight',
  },
  numberSmall: {
    ...theme.textLight24,
    fontFamily: 'SourceSansPro-ExtraLight',
  },
  numberNull: {
    color: theme.lightGrey,
  },
});
