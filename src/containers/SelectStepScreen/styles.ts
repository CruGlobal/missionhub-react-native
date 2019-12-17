import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.extraLightGrey,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
    color: theme.white,
    paddingHorizontal: 60,
    textAlign: 'center',
    letterSpacing: 2,
  },
});
