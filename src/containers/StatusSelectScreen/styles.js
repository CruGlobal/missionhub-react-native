import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor,
  },
  headerButton: {
    width: 80,
    marginHorizontal: 10,
    marginTop: 5,
  },
  headerButtonText: {
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'right',
  },
  headerButtonTextCancel: {
    textAlign: 'left',
  },
  headerButtonTextDone: {
    textAlign: 'right',
  },
  listWrap: {
    backgroundColor: theme.white,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  selected: {
    color: theme.secondaryColor,
  },
  icon: {
    color: theme.secondaryColor,
  },
});
