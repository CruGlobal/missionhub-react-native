import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  header: {
    fontSize: 24,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: '300',
    color: theme.primaryColor,
    paddingTop: 10,
  },
  description: {
    fontSize: 16,
    color: theme.textColor,
    paddingHorizontal: 80,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
