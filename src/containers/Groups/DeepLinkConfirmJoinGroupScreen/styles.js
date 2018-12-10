import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  imageWrap: {
    marginTop: 5,
    minHeight: theme.fullHeight * 0.3,
  },
  text: {
    fontSize: 16,
    color: theme.white,
    textAlign: 'center',
    padding: 4,
  },
});
