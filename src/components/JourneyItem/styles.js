
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 19,
    paddingRight: 24,
    backgroundColor: theme.white,
    width: theme.fullWidth,
  },
  icon: {
    width: 75,
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.secondaryColor,
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
  title: {
    color: theme.secondaryColor,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
  },
});
