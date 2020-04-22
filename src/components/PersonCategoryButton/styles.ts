import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  categoryButton: {
    width: theme.fullWidth - 100,
    marginVertical: 4,
    height: 72,
    backgroundColor: theme.accentColor,
  },
  categoryActive: {
    backgroundColor: theme.parakeetBlue,
  },
  categoryButtonText: {
    color: theme.white,
    fontFamily: 'SourceSansPro-Light',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
  },
});