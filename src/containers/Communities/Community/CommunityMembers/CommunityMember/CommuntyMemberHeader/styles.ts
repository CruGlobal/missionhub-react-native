import { StyleSheet } from 'react-native';

import theme from '../../../../../../theme';

export default StyleSheet.create({
  container: { backgroundColor: theme.primaryColor },
  content: { alignItems: 'center' },
  personName: {
    fontWeight: '300',
    fontSize: 24,
    color: theme.white,
    marginTop: 12,
    marginBottom: 24,
  },
});
