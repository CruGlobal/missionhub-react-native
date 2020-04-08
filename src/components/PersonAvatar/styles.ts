import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.communityProfile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontWeight: '300',
    color: theme.white,
  },
});
