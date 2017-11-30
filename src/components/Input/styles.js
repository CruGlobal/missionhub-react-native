
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.accentColor,
    backgroundColor: theme.transparent,
    paddingVertical: 5,
    color: theme.white,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    letterSpacing: .25,
  },
});
