
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  top: {
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: 27,
    paddingVertical: 32,
  },
  topBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: theme.white,
    padding: 25,
  },
  title: {
    fontSize: 36,
    color: theme.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    height: 290,
    backgroundColor: theme.white,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  stepPerson: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  stepDescription: {
    fontSize: 14,
  },
});
