import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { isAndroid } from '../../utils/common';

export default StyleSheet.create({
  skipWrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 10,
  },
  skipBtn: {
    padding: 15,
  },
  skipBtnText: {
    color: theme.white,
  },
});
