import { StyleSheet } from 'react-native';
import theme from '../../theme';
import { isiPhoneX } from '../../utils/common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 40,
  },
  errorBar: {
    backgroundColor: '#FF5532',
    height: isiPhoneX() ? 85 : 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: theme.white,
    fontSize: 16,
    marginTop: isiPhoneX() ? 25 : 0,
  },
  label: {
    color: theme.secondaryColor,
    fontSize: 12,
  },
  mfaHeader: {
    fontSize: 36,
    textAlign: 'center',
    paddingVertical: 10,
    lineHeight: 32,
    color: theme.secondaryColor,
    letterSpacing: 2,
  },
  mfaDescription: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
    color: theme.white,
    lineHeight: 32,
    letterSpacing: .25,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
