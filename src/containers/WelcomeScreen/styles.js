import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
  },
  descriptionText: {
    color: theme.white,
    textAlign: 'left',
    paddingVertical: 10,
    fontSize: 24,
    lineHeight: 32,
  },
  headerText: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
});
