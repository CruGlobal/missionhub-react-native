import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  stepUserName: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  flex1: {
    flex: 1,
  },
  reminderButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 4,
  },
  bellIcon: {
    fontSize: 18,
    paddingRight: 8,
    paddingLeft: 8,
    color: theme.secondaryColor,
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
  description: {
    fontSize: 14,
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
