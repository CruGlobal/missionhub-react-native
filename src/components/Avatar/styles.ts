import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: {
    ...theme.textRegular12,
    color: theme.white,
    textAlign: 'center',
    textAlignVertical: 'bottom',
  },
});
