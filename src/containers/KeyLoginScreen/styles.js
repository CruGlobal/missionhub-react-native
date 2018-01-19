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
    position: 'absolute',
    height: 60,
    width: '100%',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: theme.white,
    fontSize: 16,
  },
});
