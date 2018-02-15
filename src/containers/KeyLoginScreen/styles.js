import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  logo: {
    // marginTop: 50,
    // height: 100,
  },
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
  facebookButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    margin: 8,
    width: theme.fullWidth - 80,
    height: 48,
  },
  buttonText: {
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 2,
    letterSpacing: 1.5,
  },
  icon: {
    marginRight: 10,
  },
});
