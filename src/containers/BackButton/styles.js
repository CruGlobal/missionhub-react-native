
import { StyleSheet } from 'react-native';
import { isiPhoneX } from '../../utils/common';

const margin = 25;

export default StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  button: {
    top: isiPhoneX() ? margin + 25 : margin,
    left: 5,
  },
});
