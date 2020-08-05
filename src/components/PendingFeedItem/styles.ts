import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginHorizontal: 7,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  retryText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: theme.secondaryColor,
  },
  endWrapper: {
    width: 24,
    height: 24,
  },
  closeIcon: {
    color: theme.lightGrey,
  },
});
