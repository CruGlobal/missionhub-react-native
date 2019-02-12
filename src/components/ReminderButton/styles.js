import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  reminderButton: {
    borderColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 30,
  },
  reminderIcon: {
    padding: 10,
    fontSize: 35,
    color: theme.secondaryColor,
  },
  reminderText: {
    color: theme.secondaryColor,
    fontSize: 16,
  },
});
