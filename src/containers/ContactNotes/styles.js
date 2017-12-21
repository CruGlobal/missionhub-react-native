import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  notesText: {
    flex: 1,
    fontSize: 16,
    color: theme.textColor,
    textAlign: 'center',
  },
  notesIcon: {
    fontSize: 96,
    color: theme.primaryColor,
  },
  nullHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  nullText: {
    fontSize: 16,
    color: theme.textColor,
    paddingHorizontal: 70,
    textAlign: 'center',
    paddingVertical: 10,
  },
  list: {
    backgroundColor: theme.transparent,
  },
});
