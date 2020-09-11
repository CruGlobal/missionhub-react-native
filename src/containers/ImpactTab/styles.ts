import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  backgroundWrapper: {
    position: 'absolute',
    top: 260,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundTop: {
    flex: 1,
    backgroundColor: theme.secondaryColor,
  },
  backgroundBottom: {
    flex: 1,
    backgroundColor: '#3EB1C8',
  },
});
