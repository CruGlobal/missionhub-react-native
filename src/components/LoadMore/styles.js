import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  button: {
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.grey1,
    borderRadius: 25,
    width: 250,
    alignSelf: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 18,
    color: theme.grey1,
  },
});
