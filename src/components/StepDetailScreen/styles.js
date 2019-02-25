import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  backButton: {
    color: theme.inactiveColor,
  },
  bodyStyle: {
    flex: 1,
    marginVertical: 26,
    paddingHorizontal: 32,
    paddingBottom: 14,
  },
  stepTitleText: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '300',
    marginVertical: 26,
    marginHorizontal: 32,
  },
});
