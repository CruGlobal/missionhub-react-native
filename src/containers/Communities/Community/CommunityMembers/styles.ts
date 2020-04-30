import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  membersCount: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    color: theme.grey,
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
    paddingVertical: 10,
  },
  close: {
    margin: 5,
  },
  closeButton: {
    backgroundColor: theme.lightGrey,
    borderRadius: 5,
  },
});
