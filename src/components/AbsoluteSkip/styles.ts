import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  skipWrap: {
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
