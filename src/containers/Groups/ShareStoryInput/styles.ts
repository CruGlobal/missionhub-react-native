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
  inputButton: {
    borderColor: theme.lightGrey,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 12,
    height: 32,
    marginHorizontal: 20,
    alignItems: 'flex-start',
  },
  inputText: {
    fontSize: 14,
    height: 18,
    color: theme.lightGrey,
  },
});
