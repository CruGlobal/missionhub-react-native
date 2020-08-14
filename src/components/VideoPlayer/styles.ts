import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
  smallScreenWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#00000066',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000066',
  },
  controlBarBackground: {
    backgroundColor: '#00000066',
  },
  controlBarWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  countdownTextWrap: {
    width: 40,
    alignItems: 'flex-start',
  },
  countdownText: {
    fontWeight: '300',
    color: theme.white,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  pausePlayButton: {
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: theme.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
