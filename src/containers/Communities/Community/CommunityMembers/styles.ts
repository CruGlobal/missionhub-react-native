import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  membersCount: {
    ...theme.textLight24,
    marginTop: 15,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  closeSafe: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeWrap: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  close: {
    margin: 2,
  },
  closeButton: {
    backgroundColor: theme.lightGrey,
    borderRadius: 25,
  },
});
