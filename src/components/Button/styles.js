
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  button: {
    backgroundColor: theme.buttonBackgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 0,
    margin: 0,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.buttonTextColor,
    fontSize: 18,
    textAlign: 'center',
  },
  icon: {
    color: theme.buttonIconColor,
    fontSize: 24,
    paddingRight: 10,
  },
  transparent: {
    backgroundColor: theme.transparent,
  },
  primary: {
    backgroundColor: theme.primaryColor,
    height: 60,
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: theme.secondaryColor,
    height: 60,
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
  pill: {
    borderRadius: 50,
  },
});
