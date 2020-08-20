import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.orange,
  },
  playButton: {
    margin: 16,
    paddingLeft: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#00000066',
  },
});
