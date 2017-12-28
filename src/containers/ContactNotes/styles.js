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
    textAlign: 'left',
    paddingHorizontal: 36,
    marginTop: 30,
  },
  nullHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    paddingTop: 10,
  },
  nullText: {
    fontSize: 16,
    color: theme.textColor,
    paddingHorizontal: 50,
    textAlign: 'center',
    paddingVertical: 10,
  },
  list: {
    backgroundColor: theme.transparent,
  },
});
