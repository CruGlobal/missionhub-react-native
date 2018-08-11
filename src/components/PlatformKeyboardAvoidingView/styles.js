import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  label: {
    color: theme.secondaryColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
  },
  input: {
    color: 'white',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    letterSpacing: 0.25,
    borderBottomColor: theme.secondaryColor,
  },
});
