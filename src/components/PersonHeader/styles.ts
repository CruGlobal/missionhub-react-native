import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: { backgroundColor: theme.primaryColor },
  content: { alignItems: 'center', marginBottom: 24 },
  avatar: { marginTop: -30 },
  personName: {
    ...theme.textLight24,
    color: theme.white,
    marginTop: 12,
  },
  stage: {
    ...theme.textBold14,
    marginTop: 4,
    color: theme.white,
  },
});
