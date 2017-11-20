
import { StyleSheet } from 'react-native';
import theme from '../../theme';
import DeviceInfo from 'react-native-device-info';

const margin = 20;

export default StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    margin: margin,
    marginTop: (DeviceInfo.getModel() === 'iPhone X' ? 50 : margin),
  },
  buttonText: {
    color: theme.primaryColor,
  },
  emptyText: {
    color: theme.textColor,
  },
});
