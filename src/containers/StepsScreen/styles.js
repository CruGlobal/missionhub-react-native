
import { StyleSheet } from 'react-native';
import { isAndroid } from '../../utils/common';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundTop: {
    backgroundColor: theme.backgroundColor,
  },
  backgroundBottom: {
    backgroundColor: theme.white,
  },
  contentContainer: {
    backgroundColor: theme.white,
  },
  top: {
    width: theme.fullWidth,
    backgroundColor: theme.backgroundColor,
  },
  topEmpty: {
    paddingHorizontal: 27,
    paddingVertical: 32,
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
  },
  list: {
    overflow: 'scroll',
    backgroundColor: theme.white,
    paddingBottom: isAndroid ? 50 : undefined,
  },
  nullHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  nullText: {
    fontSize: 16,
    color: theme.textColor,
    paddingHorizontal: 70,
    textAlign: 'center',
    paddingVertical: 10,
  },
  gif: {
    flex: 1,
    width: theme.fullWidth,
  },
  loadText: {
    fontSize: 64,
    color: theme.primaryColor,
    paddingVertical: 0,
  },
});
