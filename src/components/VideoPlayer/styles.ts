import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
  deleteWrap: {
    width: theme.fullWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  deleteButton: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: theme.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
