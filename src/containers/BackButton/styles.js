
import { StyleSheet } from 'react-native';

import { isiPhoneX } from '../../utils/common';

const margin = 25;

export default StyleSheet.create({
  absoluteTopLeft: {
    position: 'absolute',
    top: isiPhoneX() ? margin + 25 : margin,
    left: 5,
  },
});
