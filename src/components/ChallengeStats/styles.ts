import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  subHeader: {
    color: theme.inactiveColor,
    fontSize: 12,
    lineHeight: 16,
  },
  number: {
    color: theme.challengeBlue,
    fontFamily: 'SourceSansPro-ExtraLight',
    fontSize: 32,
    lineHeight: 38,
  },
  numberSmall: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-ExtraLight',
    fontSize: 24,
    lineHeight: 30,
  },
});
