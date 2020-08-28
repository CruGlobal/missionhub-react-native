import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  text: theme.textRegular14,
  badge: {
    position: 'absolute',
    top: -3,
    right: -10,
    backgroundColor: theme.orange,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.white,
  },
});
