import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  skipBtn: {
    padding: 15,
  },
  skipBtnText: {
    ...theme.textBold14,
    color: theme.white,
  },
});
