import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  reminderButton: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  reminderIconCircle: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: theme.secondaryColor,
    margin: 8,
  },
  reminderIcon: {
    fontSize: 16,
    color: theme.white,
  },
  reminderText: {
    color: theme.secondaryColor,
    fontSize: 16,
  },
});
