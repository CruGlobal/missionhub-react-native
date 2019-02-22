import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { isAndroid } from '../../utils/common';

export default StyleSheet.create({
  skipWrap: {
    position: 'absolute',
    top: (isAndroid ? 7 : 25) + theme.topNotchHeight,
    right: 10,
  },
  skipBtn: {
    padding: 15,
  },
  skipBtnText: {
    color: theme.white,
  },
});
