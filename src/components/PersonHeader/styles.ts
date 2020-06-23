import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: { backgroundColor: theme.primaryColor },
  content: { alignItems: 'center', marginBottom: 24 },
  avatar: { marginTop: -30 },
  personName: {
    fontWeight: '300',
    fontSize: 24,
    color: theme.white,
    marginTop: 12,
  },
  stage: {
    marginTop: 4,
    color: theme.white,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
