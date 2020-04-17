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
    marginTop: -5,
    paddingTop: 5,
  },
  inputButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.extraLightGrey,
    borderRadius: 20,
    marginVertical: 20,
    height: 36,
    marginHorizontal: 20,
  },
  inputText: {
    fontSize: 14,
    height: 18,
    color: theme.grey,
    paddingLeft: 10,
  },
});
