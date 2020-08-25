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
    ...theme.textLight24,
    maxWidth: 200,
    color: theme.white,
    textAlign: 'center',
  },
  chooseCategoryTextOnboarding: {
    maxWidth: 280,
  },
});
