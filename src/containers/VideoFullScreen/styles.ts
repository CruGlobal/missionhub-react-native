import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  videoPlayer: {
    position: 'absolute',
    width: theme.fullWidth,
    height: theme.fullHeight,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  closeWrap: {
    width: theme.fullWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  closeButton: {
    margin: 18,
    borderRadius: 18,
    backgroundColor: theme.fadedBlackBackgroundColor,
  },
  controlBarBackground: {
    backgroundColor: theme.fadedBlackBackgroundColor,
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
    ...theme.textLight24,
    color: theme.white,
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
  playButtonPadding: {
    paddingLeft: 17,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
