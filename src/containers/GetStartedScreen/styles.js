import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  headerTitle: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
  text: {
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
    padding: 30,
    lineHeight: 24,
  },
});
