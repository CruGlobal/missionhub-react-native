
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  button: {
    backgroundColor: theme.buttonBackgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderColor: theme.buttonBorderColor,
    borderWidth: theme.buttonBorderWidth,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.buttonTextColor,
    fontSize: 16,
  },
  icon: {
    color: theme.buttonIconColor,
    fontSize: 24,
    paddingRight: 10,
  },
  transparent: {
    backgroundColor: COLORS.TRANSPARENT,
  },
  header: {
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  textHeader: {
    color: theme.headerTextColor,
  },
  iconHeader: {
    color: theme.headerTextColor,
  },
  imageStyle: {
    // width: 20,
  },
});
