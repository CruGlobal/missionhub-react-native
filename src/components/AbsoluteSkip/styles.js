import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { isiPhoneX } from '../../utils/common';

export default StyleSheet.create({
  skipWrap: {
    position: 'absolute',
    top: 15 + (isiPhoneX() ? 40 : 20),
    right: 10,
  },
  skipBtn: {
    padding: 15,
  },
  skipBtnText: {
    color: theme.white,
  },
});
