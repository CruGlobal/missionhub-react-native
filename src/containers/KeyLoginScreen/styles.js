import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  label: {
    color: theme.secondaryColor,
    fontSize: 12,
  },
  header: {
    color: theme.white,
    fontSize: 24,
  },
  errorBar: {
    backgroundColor: '#FF5532',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: theme.white,
    fontSize: 16,
  },
});
