import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  descriptionText: {
    color: theme.white,
    textAlign: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  headerText: {
    color: theme.secondaryColor,
    fontSize: 48,
  },
});
