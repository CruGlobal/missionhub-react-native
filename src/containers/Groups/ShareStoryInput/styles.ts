import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    borderBottomColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 5,
  },
  inputContainer: {
    color: theme.extraLightGrey,
    borderColor: theme.lightGrey,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: theme.white,
    marginVertical: 12,
  },
  input: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginVertical: 2,
    marginLeft: 12,
    color: theme.lightGrey,
    borderBottomWidth: 0,
    fontSize: 14,
  },
});
