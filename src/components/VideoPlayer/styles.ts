import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    aspectRatio: 9.0 / 16.0,
    width: '100%',
  },
  controlsWrap: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
