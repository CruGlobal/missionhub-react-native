import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  removeStepButton: {
    paddingRight: 10,
  },
  removeStepButtonText: {
    color: theme.inactiveColor,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  reminderButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  reminderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
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
    fontSize: 18,
    color: theme.white,
  },
  reminderText: {
    fontSize: 16,
  },
  cancelIconButton: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.inactiveColor,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 8,
  },
  cancelIcon: {
    fontSize: 18,
    color: theme.inactiveColor,
  },
});
