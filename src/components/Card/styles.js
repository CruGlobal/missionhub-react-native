import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginBottom: 20,
    padding: 20,
    backgroundColor: theme.white,
    borderRadius: 5,
    shadowRadius: 3,
    shadowColor: theme.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 2 },
  },
});
