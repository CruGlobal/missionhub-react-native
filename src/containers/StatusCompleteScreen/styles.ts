import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  content: {
    marginTop: 50,
    paddingHorizontal: 35,
  },
  text: {
    fontSize: 24,
    color: theme.white,
    marginBottom: 25,
  },
  button: {
    padding: 13,
    borderColor: theme.secondaryColor,
    borderWidth: 1,
    borderRadius: 25,
    alignSelf: 'stretch',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 14,
  },
});
