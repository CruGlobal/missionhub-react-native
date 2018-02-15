
import { StyleSheet } from 'react-native';
import theme from '../../theme';
import { isiPhoneX } from '../../utils/common';

const margin = 25;

export default StyleSheet.create({
  absoluteTopLeft: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    margin: margin,
    marginTop: (isiPhoneX() ? 50 : margin + 20),
  },
  buttonText: {
    color: theme.primaryColor,
  },
  emptyText: {
    color: theme.textColor,
  },
});
