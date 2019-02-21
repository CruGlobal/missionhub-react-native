import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 20,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 16,
    lineHeight: 22,
  },
  iconButton: {
    height: 24,
    width: 24,
    paddingHorizontal: 0,
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
