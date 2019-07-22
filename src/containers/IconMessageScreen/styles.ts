import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'left',

    paddingVertical: 10,
    color: theme.white,
    lineHeight: 32,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
