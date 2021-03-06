import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.black,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
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
    width: theme.fullWidth,
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
  recordButton: {
    height: 48,
    width: 48,
    borderWidth: 2,
    borderColor: theme.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startRecordIcon: {
    backgroundColor: theme.orange,
    height: 24,
    width: 24,
    borderRadius: 12,
    opacity: 1.0,
  },
  endRecordIcon: {
    backgroundColor: theme.orange,
    height: 20,
    width: 20,
    borderRadius: 2,
    opacity: 1.0,
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
});
