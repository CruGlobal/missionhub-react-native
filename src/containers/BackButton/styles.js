
import { StyleSheet } from 'react-native';
import { isiPhoneX } from '../../utils/common';

const margin = 25;

export default StyleSheet.create({
  absoluteTopLeft: {
    position: 'absolute',
    top: isiPhoneX() ? 50 : margin + 20,
    left: margin,
  },
});
