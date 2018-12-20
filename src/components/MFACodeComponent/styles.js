import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { hasNotch } from '../../utils/common';

const marginTop = hasNotch() ? 50 : 25;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 40,
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
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  backButton: {
    marginLeft: 5,
    marginTop,
  },
  doneButton: {
    marginRight: 10,
    marginTop,
  },
  doneButtonText: {
    fontSize: 14,
    letterSpacing: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
