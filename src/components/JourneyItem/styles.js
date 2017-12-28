
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 19,
    paddingHorizontal: 24,
    backgroundColor: theme.white,
    width: theme.fullWidth,
  },
  icon: {
    color: theme.secondaryColor,
    paddingRight: 15,
  },
  textWrap: {
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
    paddingLeft: 20,
    paddingBottom: 5,
  },
  date: {
    color: theme.inactiveColor,
    fontSize: 10,
  },
  text: {
    fontSize: 14,
  },
});
