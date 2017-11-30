
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  header: {
    fontSize: 36,
    color: theme.white,
  },
  fieldWrap: {
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  input: {
    borderBottomColor: theme.secondaryColor,
  },
  createButton: {
    width: theme.fullWidth,
  },
});
