import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 75,
  },
  text: {
    fontSize: 24,
  },
  button: {
    width: 200,
    marginBottom: 15,
  },
});
