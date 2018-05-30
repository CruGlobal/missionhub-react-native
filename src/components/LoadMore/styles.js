import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  button: {
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.grey1,
    borderRadius: 25,
    minWidth: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 14,
    color: theme.grey1,
  },
});
