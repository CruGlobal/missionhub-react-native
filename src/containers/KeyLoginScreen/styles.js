import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  label: {
    color: theme.secondaryColor,
    fontSize: 12,
  },
  input: {
    color: 'white',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    letterSpacing: .25,
    borderBottomColor: theme.secondaryColor,
  },
  header: {
    color: theme.white,
    fontSize: 24,
  },
});
