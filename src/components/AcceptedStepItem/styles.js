import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 16,
    alignItems: 'center',
  },
  reminderButton: {
    borderWidth: 1,
    justifyContent: 'flex-start',
    padding: 4,
  },
  bellIcon: {
    fontSize: 18,
    color: theme.secondaryColor,
  },
  reminderText: {
    borderWidth: 1,
    color: theme.secondaryColor,
    paddingLeft: 8,
    fontSize: 14,
    lineHeight: 18,
  },
  stepText: {
    flex: 1,
    padding: 4,
    paddingRight: 32,
    fontSize: 16,
    lineHeight: 22,
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
