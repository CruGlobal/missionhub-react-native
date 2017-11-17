
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  button: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  empty: {
    backgroundColor: theme.buttonBackgroundColor,
    borderColor: theme.buttonBorderColor,
    borderWidth: theme.buttonBorderWidth,
  },
  buttonText: {
    color: theme.primaryColor,
  },
  emptyText: {
    color: theme.textColor,
  },
});
