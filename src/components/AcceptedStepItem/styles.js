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
  checkIcon: {
    fontSize: 20,
  },
  active: {
    color: theme.secondaryColor,
  },
  completed: {
    color: theme.inactiveColor,
  },
});
