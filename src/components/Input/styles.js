
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.accentColor,
    // backgroundColor: COLORS.YELLOW,
    backgroundColor: COLORS.TRANSPARENT,
    paddingVertical: 5,
    color: theme.lightText,
  },
});
