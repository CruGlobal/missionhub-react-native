import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';
import { isiPhoneX } from '../../utils/common';

export default StyleSheet.create({
  background: {
    backgroundColor: COLORS.GREY,
    paddingTop: isiPhoneX() ? 30 : 0,
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
