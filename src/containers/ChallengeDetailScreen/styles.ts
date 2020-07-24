import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    backgroundColor: theme.white,
    height: '100%',
  },
  headerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingRight: 10,
  },
  buttonText: {
    color: theme.parakeetBlue,
    fontSize: 14,
  },
  challengeImage: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    right: 0,
  },
});
