
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  searchWrap: {
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  input: {
    borderBottomWidth: 0,
    paddingVertical: 5,
    flex: 1,
    fontSize: 16,
    color: theme.white,
  },
  clearIcon: {
    paddingHorizontal: 5,
    fontSize: 10,
  },
  nullWrap: {
    marginBottom: 40,
  },
  nullHeader: {
    fontSize: 84,
    letterSpacing: 2,
    color: theme.primaryColor,
  },
  nullText: {
    fontSize: 16,
  },
});
