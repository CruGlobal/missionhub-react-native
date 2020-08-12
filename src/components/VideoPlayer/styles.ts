import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsWrap: {
    width: theme.fullWidth,
  },
});
