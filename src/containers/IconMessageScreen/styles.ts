import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    paddingVertical: 36,
    paddingHorizontal: 60,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 24,
    textAlign: 'left',
    paddingVertical: 20,
    color: theme.white,
    lineHeight: 32,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
