
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  headerWrap: {
    backgroundColor: theme.primaryColor,
  },
  headerTitle: {
    fontSize: 36,
    color: theme.secondaryColor,
  },
  headerText: {
    fontSize: 16,
    color: theme.white,
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    lineHeight: 24,
  },
  addButton: {
    width: theme.fullWidth,
  },
});
