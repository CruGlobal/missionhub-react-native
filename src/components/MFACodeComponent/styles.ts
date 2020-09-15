import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
  },
  label: {
    ...theme.textRegular12,
    color: theme.secondaryColor,
  },
  mfaHeader: {
    ...theme.textAmatic36,
    textAlign: 'center',
    paddingVertical: 10,
    color: theme.secondaryColor,
  },
  mfaDescription: {
    ...theme.textRegular16,
    textAlign: 'center',
    paddingVertical: 10,
    color: theme.white,
  },
  doneButtonText: {
    ...theme.textBold14,
    color: theme.white,
    letterSpacing: 1.5,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
