import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  contentWrap: {
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 13,
    marginTop: 1,
    minHeight: 80,
    alignItems: 'center',
    flexDirection: 'row',
  },
  swipeable: {
    backgroundColor: theme.white,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  reminder: {
    backgroundColor: theme.convert({
      color: theme.secondaryColor,
      lighten: 0.4,
    }),
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  contact: {
    backgroundColor: theme.white,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  nameWrap: {
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
  },
  iconWrap: {
    flex: 0,
  },
  icon: {
    padding: 10,
    fontSize: 35,
    color: theme.secondaryColor,
  },
  iconReminder: {
    color: theme.primaryColor,
  },
});
