import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { hasNotch } from '../../utils/common';

export default StyleSheet.create({
  skipWrap: {
    position: 'absolute',
    top: 15 + (hasNotch() ? 40 : 20),
    right: 10,
  },
  skipBtn: {
    padding: 15,
  },
  skipBtnText: {
    color: theme.white,
  },
});
