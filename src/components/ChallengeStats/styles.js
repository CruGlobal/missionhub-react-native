import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  subHeader: {
    color: theme.inactiveColor,
    fontSize: 10,
  },
  number: {
    color: theme.primaryColor,
    fontFamily: 'SourceSansPro-ExtraLight',
    fontSize: 48,
    lineHeight: 50,
  },
  numberSmall: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-ExtraLight',
    fontSize: 32,
    lineHeight: 32,
  },
});
