
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 13,
    width: theme.fullWidth,
    marginTop: 1,
  },
  swipeable: {
    backgroundColor: theme.white,
  },
  reminder: {
    backgroundColor: theme.convert({ color: theme.secondaryColor, lighten: 0.4 }),
  },
  contact: {
    backgroundColor: theme.white,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  person: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  description: {
    fontSize: 14,
  },
  icon: {
    padding: 10,
    fontSize: 35,
    color: theme.secondaryColor,
  },
  iconReminder: {
    color: theme.primaryColor,
  },
});
