import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  background: {
    backgroundColor: COLORS.GREY,
    flex: 1,
  },
  buttonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.inactiveColor,
  },
  button: {
    margin: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  buttonText: {
    color: theme.white,
    fontSize: 14,
  },
});
