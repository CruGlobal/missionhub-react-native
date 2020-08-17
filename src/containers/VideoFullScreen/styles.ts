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
