import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  reminderButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  completedIcon: {
    margin: 10,
    height: 24,
    width: 24,
  },
  completedText: {
    color: theme.textColor,
    fontSize: 16,
  },
});
