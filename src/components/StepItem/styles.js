
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 15,
    paddingLeft: 24,
    paddingRight: 13,
    backgroundColor: theme.transparent,
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
    color: theme.primaryColor,
  },
});
