import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
  controlWrap: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonWrap: {
    width: theme.fullWidth,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerButton: {
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayButton: {
    backgroundColor: '#00000066',
  },
  redButton: {
    backgroundColor: theme.red,
  },
  playButton: {
    margin: 16,
    paddingLeft: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
