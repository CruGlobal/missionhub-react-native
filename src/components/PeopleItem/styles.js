
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    height: theme.itemHeight,
    paddingHorizontal: 24,
    backgroundColor: theme.white,
    width: theme.fullWidth,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  stage: {
    fontSize: 14,
  },
});
