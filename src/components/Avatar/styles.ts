import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: {
    ...theme.textRegular12,
    lineHeight: undefined, // Avoid a custom line height so flex can auto center the text
    color: theme.white,
    textAlign: 'center',
    textAlignVertical: 'bottom',
  },
});
