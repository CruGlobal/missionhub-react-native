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
  flex1: {
    flex: 1,
  },
  reminderButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 4,
  },
  reminderTextPadding: {
    paddingLeft: 8,
  },
  stepText: {
    ...theme.textRegular14,
    flex: 1,
    padding: 4,
    paddingRight: 32,
  },
  stepTextCompleted: {
    color: theme.lightGrey,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
