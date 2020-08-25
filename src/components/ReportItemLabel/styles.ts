import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  label: {
    ...theme.textRegular14,
    color: theme.extraLightGrey,
  },
  user: {
    ...theme.textRegular16,
    color: theme.white,
  },
});
