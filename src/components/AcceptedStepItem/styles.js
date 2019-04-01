import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 16,
    alignItems: 'center',
  },
  reminderButton: {
    justifyContent: 'flex-start',
    padding: 4,
  },
  bellIcon: {
    fontSize: 18,
    paddingRight: 8,
    color: theme.secondaryColor,
  },
  stepText: {
    flex: 1,
    padding: 4,
    paddingRight: 32,
    fontSize: 16,
    lineHeight: 22,
  },
  stepTextCompleted: {
    color: theme.lightGrey,
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
