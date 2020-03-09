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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
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
    paddingTop: 8,
  },
  bellIcon: {
    fontSize: 18,
    paddingRight: 8,
    color: theme.secondaryColor,
  },
  contentWrap: {
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 13,
    marginTop: 1,
    minHeight: 80,
    alignItems: 'center',
    flexDirection: 'row',
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
    alignSelf: 'center',
    paddingRight: 8,
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

  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  checkIcon: {
    height: 24,
    width: 24,
  },

  active: {
    color: theme.secondaryColor,
  },
  completed: {
    color: theme.inactiveColor,
  },
});
