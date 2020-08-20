import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  inputStyle: {
    ...theme.textLight32,
    color: theme.secondaryColor,
    marginVertical: 16,
    marginHorizontal: 32,
  },
});
