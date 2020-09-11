import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  backgroundWrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
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
