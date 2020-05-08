import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controlBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  controlBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  countdownText: {
    fontWeight: '300',
    color: theme.white,
    fontSize: 24,
    lineHeight: 30,
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
    backgroundColor: theme.red,
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  endRecordIcon: {
    backgroundColor: theme.red,
    height: 20,
    width: 20,
    borderRadius: 2,
  },
  closeButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: theme.black,
    borderRadius: 18,
    opacity: 0.5,
    margin: 18,
  },
});
