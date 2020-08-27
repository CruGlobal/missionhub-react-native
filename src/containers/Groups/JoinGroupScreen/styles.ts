import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  imageWrap: {
    marginTop: 5,
    minHeight: theme.fullHeight * 0.3,
  },
  text: {
    ...theme.textRegular16,
    color: theme.white,
    textAlign: 'center',
    padding: 4,
  },
  fieldWrap: {
    marginTop: 5,
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  input: {
    ...theme.textRegular16,
    fontSize: 36,
    color: theme.white,
    textAlign: 'center',
    padding: 8,
  },
  searchButton: {
    width: theme.fullWidth,
  },
});
