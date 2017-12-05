
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  top: {
    width: theme.fullWidth,
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: 27,
    paddingVertical: 32,
  },
  topBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
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
    backgroundColor: theme.backgroundColor,
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
    borderColor: theme.white,
    height: 60,
  },
  list: {
    flex: 1,
    backgroundColor: theme.transparent,
    overflow: 'hidden',
  },
});
