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
  stepUserName: theme.textRegular16,
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
  nameWrap: {
    alignSelf: 'center',
    paddingRight: 8,
  },
  description: theme.textRegular14,
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
});
