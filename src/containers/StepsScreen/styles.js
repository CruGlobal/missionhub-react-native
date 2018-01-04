
import { StyleSheet } from 'react-native';
import { isAndroid } from '../../utils/common';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  top: {
    ...(isAndroid ? {} : {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    }),
    width: theme.fullWidth,
    backgroundColor: theme.backgroundColor,
  },
  topEmpty: {
    paddingHorizontal: 27,
    paddingVertical: 32,
  },
  topBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 3,
    borderColor: theme.white,
    padding: 25,
  },
  title: {
    fontSize: 36,
    color: theme.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  topItems: {
    paddingHorizontal: 25,
    paddingBottom: 25,
  },
  topTitle: {
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 14,
    color: theme.white,
  },
  dropZone: {
    width: theme.fullWidth,
    paddingHorizontal: 30,
  },
  dropZoneBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 3,
    borderColor: theme.white,
    height: 60,
  },
  list: {
    overflow: 'scroll',
    backgroundColor: theme.transparent,
    paddingBottom: isAndroid ? 50 : undefined,
  },
});
