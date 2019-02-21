import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  header: {
    fontSize: 36,
    color: theme.white,
  },
  journeyHeader: {
    fontSize: 36,
    color: theme.secondaryColor,
    paddingHorizontal: 60,
    textAlign: 'center',
  },
  fieldWrap: {
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  createButton: {
    width: theme.fullWidth,
  },
  skipBtn: {
    marginTop: 0,
    padding: 30,
  },
  skipBtnText: {
    fontSize: 14,
    color: theme.white,
    fontWeight: 'bold',
  },
});
