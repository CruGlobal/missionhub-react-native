import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  skipBtn: {
    padding: 15,
  },
  skipBtnText: {
    ...theme.textRegular14,
    color: theme.white,
  },
});
