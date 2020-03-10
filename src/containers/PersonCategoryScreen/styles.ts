import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  textWrap: { alignItems: 'center', marginBottom: 50 },
  chooseCategoryText: {
    fontFamily: 'SourceSansPro-Light',
    color: theme.white,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    textAlign: 'center',
  },
});
