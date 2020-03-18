import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    backgroundColor: theme.extraLightGrey,
  },
  header: {
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: theme.extraLightGrey,
    marginVertical: 8,
  },
  title: {
    fontSize: 12,
    color: theme.lightGrey,
    textAlign: 'center',
  },
  nullContainer: {
    marginTop: 5,
    backgroundColor: theme.extraLightGrey,
  },
});
