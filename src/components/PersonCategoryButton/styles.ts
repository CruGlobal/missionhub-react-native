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
    backgroundColor: '#3CC8E6',
  },
  categoryButtonText: {
    color: theme.white,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
  },
});
