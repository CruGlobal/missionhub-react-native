import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 10,
  },
  name: {
    color: theme.white,
    fontSize: 24,
  },
  stage: {
    color: theme.white,
    fontSize: 14,
    letterSpacing: 0.25,
  },
});
