import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    padding: 30,
    color: theme.white,
  },
});
