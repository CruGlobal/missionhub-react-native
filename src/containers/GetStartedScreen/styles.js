import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
  },
  headerTitle: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
  text: {
    color: theme.white,
    fontSize: 24,
    textAlign: 'left',
    paddingVertical: 10,
    lineHeight: 32,
  },
});
