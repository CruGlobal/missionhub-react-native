import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { isAndroid } from '../../utils/common';

export default StyleSheet.create({
  absoluteTopLeft: {
    position: 'absolute',
    top: (isAndroid ? 7 : 25) + theme.topNotchHeight,
    left: 5,
  },
});
